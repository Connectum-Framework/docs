---
outline: deep
---

# Getting Started with Events

This guide walks you through setting up event-driven communication between Connectum microservices using the EventBus.

## Prerequisites

- A working Connectum project with `@connectum/core`
- Proto tooling configured (`buf` for protobuf generation)
- A message broker (or use `MemoryAdapter` for local development)

## Step 1: Install Packages

Install the core events package and a broker adapter:

::: code-group

```bash [NATS JetStream]
pnpm add @connectum/events @connectum/events-nats
```

```bash [Kafka / Redpanda]
pnpm add @connectum/events @connectum/events-kafka
```

```bash [Redis Streams]
pnpm add @connectum/events @connectum/events-redis
```

```bash [AMQP / RabbitMQ]
pnpm add @connectum/events @connectum/events-amqp
```

```bash [Memory (testing)]
pnpm add @connectum/events
# MemoryAdapter is built-in — no extra package needed
```

:::

## Step 2: Define Proto Event Handlers

Create a proto service that defines your event handlers. Each RPC method represents a handler for one event type. The input message is the event payload; the return type should be `google.protobuf.Empty`.

```protobuf
// proto/notifications/v1/events.proto
syntax = "proto3";

package notifications.v1;

import "google/protobuf/empty.proto";

// Events published by the User service
message UserCreated {
  string id = 1;
  string email = 2;
  string name = 3;
}

message UserDeleted {
  string id = 1;
}

// Event handler service for the Notification service
service NotificationEventHandlers {
  rpc OnUserCreated(UserCreated) returns (google.protobuf.Empty);
  rpc OnUserDeleted(UserDeleted) returns (google.protobuf.Empty);
}
```

Generate the TypeScript code:

```bash
pnpm run build:proto
```

## Step 3: Create an Adapter

Create the adapter instance with broker-specific configuration:

::: code-group

```typescript [NATS JetStream]
import { NatsAdapter } from '@connectum/events-nats';

const adapter = NatsAdapter({
  servers: process.env.NATS_URL ?? 'nats://localhost:4222',
  stream: 'notifications',
});
```

```typescript [Kafka / Redpanda]
import { KafkaAdapter } from '@connectum/events-kafka';

const brokers = (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',');
const adapter = KafkaAdapter({
  brokers,
  clientId: 'notification-service',
});
```

```typescript [Redis Streams]
import { RedisAdapter } from '@connectum/events-redis';

const adapter = RedisAdapter({
  url: process.env.REDIS_URL ?? 'redis://localhost:6379',
});
```

```typescript [AMQP / RabbitMQ]
import { AmqpAdapter } from '@connectum/events-amqp';

const adapter = AmqpAdapter({
  url: process.env.AMQP_URL ?? 'amqp://localhost:5672',
});
```

```typescript [Memory]
import { MemoryAdapter } from '@connectum/events';

const adapter = MemoryAdapter();
```

:::

## Step 4: Implement Event Handlers

Define typed event handlers using the `EventRoute` pattern. This mirrors ConnectRPC's router registration:

```typescript
// src/events/notificationEvents.ts
import type { EventRoute } from '@connectum/events';
import { NotificationEventHandlers } from '#gen/notifications/v1/events_pb.js';

export const notificationEvents: EventRoute = (events) => {
  events.service(NotificationEventHandlers, {
    onUserCreated: async (msg, ctx) => {
      console.log(`Sending welcome email to ${msg.email}`);
      // ... send email logic
      await ctx.ack();
    },

    onUserDeleted: async (msg, ctx) => {
      console.log(`Cleaning up notifications for user ${msg.id}`);
      // ... cleanup logic
      await ctx.ack();
    },
  });
};
```

::: tip Acknowledgment
Explicit ack/nack is optional. Successful handler completion auto-acks the event. Use `ctx.ack()` or `ctx.nack()` when you need explicit control over acknowledgment timing.
:::

## Step 5: Create the EventBus

Wire everything together with `createEventBus()`:

```typescript
// src/eventBus.ts
import { createEventBus } from '@connectum/events';
import { NatsAdapter } from '@connectum/events-nats';
import { notificationEvents } from './events/notificationEvents.js';

const adapter = NatsAdapter({
  servers: process.env.NATS_URL ?? 'nats://localhost:4222',
  stream: 'notifications',
});

export const eventBus = createEventBus({
  adapter,
  routes: [notificationEvents],
  group: 'notification-service',
  handlerTimeout: 30_000,  // Per-event handler timeout (default: 30s)
  drainTimeout: 15_000,    // Wait up to 15s for in-flight handlers on shutdown
  middleware: {
    retry: { maxRetries: 3, backoff: 'exponential' },
    dlq: { topic: 'notification-service.dlq' },
  },
});
```

## Step 6: Integrate with Connectum Server

Pass the EventBus to `createServer()` for automatic lifecycle management:

```typescript
// src/index.ts
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { eventBus } from './eventBus.js';
import { routes } from './services/routes.js';

const server = createServer({
  services: [routes],
  eventBus,
  protocols: [Healthcheck({ httpEnabled: true })],
  shutdown: { autoShutdown: true },
});

server.on('ready', () => {
  healthcheckManager.update(ServingStatus.SERVING);
  console.log(`Notification service ready on port ${server.address?.port}`);
});

await server.start();
```

The server automatically calls `eventBus.start()` on startup and `eventBus.stop()` on graceful shutdown.

## Step 7: Publish Events

From another service (e.g., User Service), publish typed events:

```typescript
import { createEventBus } from '@connectum/events';
import { KafkaAdapter } from '@connectum/events-kafka';
import { UserCreatedSchema } from '#gen/notifications/v1/events_pb.js';

const eventBus = createEventBus({
  adapter: KafkaAdapter({ brokers: ['localhost:9092'], clientId: 'user-service' }),
  group: 'user-service',
});

await eventBus.start();

// Publish a typed event -- serialized as protobuf, routed by schema.typeName
await eventBus.publish(UserCreatedSchema, {
  id: '123',
  email: 'alice@example.com',
  name: 'Alice',
});
```

The topic defaults to the message's `typeName` (e.g., `notifications.v1.UserCreated`). See [Custom Topics](/en/guide/events/custom-topics) to override this.

## Full Working Example

Here is a minimal two-service setup using the MemoryAdapter for local testing:

```typescript
import { createEventBus, MemoryAdapter } from '@connectum/events';
import type { EventRoute } from '@connectum/events';
import {
  NotificationEventHandlers,
  UserCreatedSchema,
} from '#gen/notifications/v1/events_pb.js';

// Shared in-memory adapter (for testing only)
const adapter = MemoryAdapter();

// Consumer: Notification Service
const notificationEvents: EventRoute = (events) => {
  events.service(NotificationEventHandlers, {
    onUserCreated: async (msg, ctx) => {
      console.log(`Welcome email sent to ${msg.email}`);
      await ctx.ack();
    },
    onUserDeleted: async (msg, ctx) => {
      console.log(`Notifications cleaned for user ${msg.id}`);
      await ctx.ack();
    },
  });
};

const consumerBus = createEventBus({
  adapter,
  routes: [notificationEvents],
  group: 'notification-service',
});

// Producer: User Service
const producerBus = createEventBus({ adapter });

await consumerBus.start();
await producerBus.start();

// Publish — the consumer handler fires synchronously with MemoryAdapter
await producerBus.publish(UserCreatedSchema, {
  id: '1',
  email: 'alice@example.com',
  name: 'Alice',
});
// Output: "Welcome email sent to alice@example.com"

await consumerBus.stop();
await producerBus.stop();
```

## Next Steps

- [Custom Topics](/en/guide/events/custom-topics) -- override default topic naming via proto options
- [Middleware](/en/guide/events/middleware) -- configure retry, DLQ, and write custom middleware
- [Adapters](/en/guide/events/adapters) -- choose the right broker adapter for your deployment
- [with-events-redpanda](https://github.com/Connectum-Framework/examples/tree/main/with-events-redpanda) -- full saga pattern example
- [with-events-dlq](https://github.com/Connectum-Framework/examples/tree/main/with-events-dlq) -- DLQ example with NATS JetStream
