---
title: '@connectum/events-nats'
description: NATS JetStream adapter for @connectum/events EventBus
---

# @connectum/events-nats

NATS JetStream adapter for the `@connectum/events` event bus. Provides persistent at-least-once delivery through NATS JetStream with durable consumers, wildcard-based topic matching, and metadata propagation via NATS headers.

**Layer**: 2 (Broker Adapters)

::: tip Related Guides
- [Events Overview](/en/guide/events) -- event-driven architecture with Connectum
- [Adapters Comparison](/en/guide/events/adapters) -- choosing between NATS, Kafka, Redis, and in-memory adapters
- [@connectum/events](/en/packages/events) -- core EventBus API and routing
:::

::: tip Full API Reference
Complete TypeScript API documentation: API Reference (coming soon)
:::

## Installation

```bash
pnpm add @connectum/events-nats
```

**Peer dependency**: `@connectum/events`

**Transitive dependencies**: `@nats-io/transport-node`, `@nats-io/jetstream`

## Quick Start

```typescript
import { NatsAdapter } from '@connectum/events-nats';
import { createEventBus } from '@connectum/events';

const adapter = NatsAdapter({ servers: 'nats://localhost:4222' });

const bus = createEventBus({
  adapter,
  routes: [myRoutes],
  group: 'my-service',
});

await bus.start();

// Publish a typed event
await bus.publish(UserCreatedSchema, { userId: '123', email: 'user@example.com' });

// Graceful shutdown
await bus.stop();
```

## API Reference

### `NatsAdapter(options)`

Factory function that creates an `EventAdapter` for NATS JetStream.

```typescript
function NatsAdapter(options: NatsAdapterOptions): EventAdapter;
```

Pass the result to `createEventBus({ adapter })`.

### `NatsAdapterOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `servers` | `string \| string[]` | *(required)* | NATS server URL(s). Accepts a single string or an array for cluster connections |
| `stream` | `string` | `"events"` | JetStream stream name. Subjects are prefixed with `{stream}.` and the stream is auto-created on `connect()` if it does not exist |
| `connectionOptions` | `Partial<NodeConnectionOptions>` | `undefined` | NATS connection options (escape hatch for advanced config). The `servers` field is overridden by the top-level `servers` option |
| `consumerOptions` | `NatsConsumerOptions` | `undefined` | JetStream consumer tuning options |

### `NatsConsumerOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `deliverPolicy` | `"new" \| "all" \| "last"` | `"new"` | Deliver policy for new consumers. `"new"` -- only messages published after consumer creation. `"all"` -- all available messages. `"last"` -- last message per subject |
| `ackWait` | `number` | `30_000` | Ack wait timeout in milliseconds. After this period an unacknowledged message is redelivered |
| `maxDeliver` | `number` | `5` | Maximum number of delivery attempts before the message is discarded by the server |

## Configuration Examples

### Single Server

```typescript
const adapter = NatsAdapter({
  servers: 'nats://localhost:4222',
});
```

### Cluster Connection

```typescript
const adapter = NatsAdapter({
  servers: [
    'nats://nats-1.example.com:4222',
    'nats://nats-2.example.com:4222',
    'nats://nats-3.example.com:4222',
  ],
});
```

### Custom Stream and Consumer Options

```typescript
const adapter = NatsAdapter({
  servers: 'nats://localhost:4222',
  stream: 'orders',
  consumerOptions: {
    deliverPolicy: 'all',
    ackWait: 60_000,      // 60 seconds before redelivery
    maxDeliver: 10,       // up to 10 delivery attempts
  },
});
```

### Advanced NATS Connection

```typescript
const adapter = NatsAdapter({
  servers: 'nats://localhost:4222',
  connectionOptions: {
    user: 'myuser',
    pass: 'mypassword',
    timeout: 5_000,
    reconnect: true,
    maxReconnectAttempts: -1,  // unlimited
  },
});
```

::: warning TLS Connections
For TLS connections, configure certificates through `connectionOptions`:

```typescript
const adapter = NatsAdapter({
  servers: 'tls://nats.example.com:4222',
  connectionOptions: {
    tls: {
      certFile: '/path/to/cert.pem',
      keyFile: '/path/to/key.pem',
      caFile: '/path/to/ca.pem',
    },
  },
});
```
:::

## Adapter Lifecycle

The `NatsAdapter` follows the `EventAdapter` interface lifecycle managed by `createEventBus()`:

```
connect() → publish() / subscribe() → disconnect()
```

| Method | Description |
|--------|-------------|
| `connect()` | Connects to NATS, initializes JetStream client and manager, auto-creates the stream if it does not exist |
| `disconnect()` | Unsubscribes all active subscriptions, drains the NATS connection, and releases resources |
| `publish()` | Publishes a serialized event to `{stream}.{eventType}`. Metadata is propagated as NATS headers |
| `subscribe()` | Creates durable JetStream consumers for each topic pattern. Delivers messages through `RawEventHandler` with explicit ack/nak |

::: info Automatic Stream Creation
On `connect()`, the adapter checks if the configured JetStream stream exists. If not, it creates one with subjects matching `{stream}.>` (all subjects under the stream prefix). For production, you may want to pre-create streams with specific retention and storage policies.
:::

## JetStream Concepts

Understanding a few JetStream concepts helps configure the adapter effectively:

### Streams

A **stream** is a persistent message store in NATS JetStream. The adapter auto-creates a stream named after the `stream` option (default: `"events"`) that captures all subjects matching `{stream}.>`.

### Consumers

A **consumer** is a stateful view of a stream. The adapter creates **durable consumers** -- they persist across reconnections and track which messages have been delivered. Consumer names are derived deterministically from the group name and subscription pattern.

### Subjects

Events are published to subjects in the format `{stream}.{eventType}`. For example, with the default stream name, publishing a `user.created` event results in the NATS subject `events.user.created`.

### Deliver Policies

| Policy | Description |
|--------|-------------|
| `"new"` | Only receive messages published after the consumer is created |
| `"all"` | Receive all messages stored in the stream (replay) |
| `"last"` | Receive only the last message per subject |

### At-Least-Once Delivery

The adapter uses **explicit acknowledgment** (`AckPolicy.Explicit`). Each message must be acknowledged by the handler. If the handler throws an error, the message is negatively acknowledged (`nak`) and redelivered according to `ackWait` and `maxDeliver` settings.

## Metadata Propagation

Event metadata is transmitted as NATS headers, enabling cross-service context propagation:

```typescript
// Publishing with metadata
await bus.publish(OrderCreatedSchema, orderData, {
  metadata: {
    'x-correlation-id': correlationId,
    'x-tenant-id': tenantId,
  },
});
```

On the consumer side, metadata is available through `EventContext`:

```typescript
const routes = (events: EventRouter) => {
  events.service(OrderEventHandlers, {
    async onOrderCreated(event, ctx) {
      const correlationId = ctx.metadata.get('x-correlation-id');
      // ...
    },
  });
};
```

## Exports Summary

| Export | Description |
|--------|-------------|
| `NatsAdapter` | Factory function that creates a NATS JetStream adapter |
| `NatsAdapterOptions` | Configuration options type |
| `NatsConsumerOptions` | JetStream consumer tuning options type |

## Related Packages

- **[@connectum/events](./events.md)** -- Core EventBus API, routing, and middleware (peer dependency)
- **[@connectum/events-kafka](./events-kafka.md)** -- Kafka adapter alternative
- **[@connectum/events-redis](./events-redis.md)** -- Redis Streams adapter alternative
- **[@connectum/core](./core.md)** -- Server framework for hosting services alongside the event bus

## Learn More

- [NATS JetStream Documentation](https://docs.nats.io/nats-concepts/jetstream) -- official JetStream reference
- [NATS Node.js Client](https://github.com/nats-io/nats.js) -- underlying transport library
- [ADR-026](/en/contributing/adr/026-eventbus-architecture) -- architectural decision for the EventBus design
