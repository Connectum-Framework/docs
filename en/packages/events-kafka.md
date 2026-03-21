---
title: '@connectum/events-kafka'
description: Apache Kafka adapter for @connectum/events EventBus
---

# @connectum/events-kafka

Apache Kafka / Redpanda adapter for the Connectum EventBus. Implements the `EventAdapter` interface using [KafkaJS](https://kafka.js.org/), providing production-grade pub/sub with consumer groups, message compression, and topic-pattern subscriptions.

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
pnpm add @connectum/events-kafka
```

**Peer dependency**: `@connectum/events`

**Transitive dependency**: [kafkajs](https://www.npmjs.com/package/kafkajs) `^2.2.4` (installed automatically)

## Quick Start

```typescript
import { createEventBus } from '@connectum/events';
import { KafkaAdapter } from '@connectum/events-kafka';

const adapter = KafkaAdapter({
  brokers: ['localhost:9092'],
  clientId: 'my-service',
});

const eventBus = createEventBus({
  adapter,
  routes: [myEventRoutes],
  group: 'my-consumer-group',
});

await eventBus.start();
await eventBus.publish(UserCreatedSchema, { id: '1', email: 'user@example.com', name: 'Alice' });
await eventBus.stop();
```

## API Reference

### `KafkaAdapter(options)`

Factory function that creates an `EventAdapter` for Apache Kafka or Redpanda brokers.

```typescript
import { KafkaAdapter } from '@connectum/events-kafka';

function KafkaAdapter(options: KafkaAdapterOptions): EventAdapter;
```

Pass the result to `createEventBus({ adapter: ... })`.

### `KafkaAdapterOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `brokers` | `string[]` | -- | **Required.** Kafka broker addresses (e.g., `["localhost:9092"]`) |
| `clientId` | `string` | derived from proto | Client ID for this producer/consumer. Defaults to the service name derived from proto descriptors (e.g., `order.v1@pod-abc123`), falling back to `"connectum"` when no services are registered. See [Automatic Client Identification](/en/guide/events/adapters#automatic-client-identification). |
| `kafkaConfig` | `Omit<Partial<KafkaConfig>, "brokers" \| "clientId">` | -- | Additional KafkaJS configuration overrides (merged with `brokers` and `clientId`) |
| `producerOptions.compression` | `CompressionTypes` | -- | Compression type for produced messages (e.g., `CompressionTypes.GZIP`) |
| `consumerOptions.sessionTimeout` | `number` | `30000` | Session timeout in milliseconds |
| `consumerOptions.fromBeginning` | `boolean` | `false` | Whether to start consuming from the beginning of topics |
| `consumerOptions.allowAutoTopicCreation` | `boolean` | `false` | Allow automatic topic creation when subscribing |

### EventAdapter Interface

The returned adapter implements the standard `EventAdapter` interface from `@connectum/events`:

```typescript
interface EventAdapter {
  readonly name: string;                        // "kafka"
  connect(context?: AdapterContext): Promise<void>;  // Connect producer to broker
  disconnect(): Promise<void>;                  // Disconnect all consumers and producer
  publish(eventType: string, payload: Uint8Array, options?: PublishOptions): Promise<void>;
  subscribe(patterns: string[], handler: RawEventHandler, options?: RawSubscribeOptions): Promise<EventSubscription>;
}
```

The `AdapterContext` is provided automatically by the EventBus and contains a `serviceName` derived from proto service descriptors. The Kafka adapter uses it as the default `clientId` when none is explicitly configured.

### Topic Pattern Matching

The adapter converts NATS-style wildcard patterns to Kafka-compatible regular expressions for topic subscription:

| Pattern | Matches | Description |
|---------|---------|-------------|
| `user.created` | `user.created` | Exact topic match |
| `user.*` | `user.created`, `user.deleted` | Single segment wildcard |
| `user.>` | `user.created`, `user.profile.updated` | Multi-segment wildcard (greedy) |

Literal patterns (without `*` or `>`) are passed directly as Kafka topic names. Wildcard patterns are converted to `RegExp` for Kafka's regex-based subscription.

### Message Headers

The adapter automatically manages message headers:

**Published headers (set automatically):**

| Header | Description |
|--------|-------------|
| `x-event-id` | Unique UUID for the event |
| `x-published-at` | ISO 8601 timestamp of publication |

**Custom metadata** passed via `PublishOptions.metadata` is encoded as additional Kafka headers.

On the consumer side, all headers are parsed and exposed via `RawEvent.metadata` (with internal headers stripped).

## Redpanda Compatibility

[Redpanda](https://redpanda.com/) is a Kafka-compatible streaming platform. The `KafkaAdapter` works with Redpanda out of the box -- simply point `brokers` to your Redpanda cluster:

```typescript
const adapter = KafkaAdapter({
  brokers: ['localhost:19092'],
  clientId: 'my-service',
});
```

No additional configuration is needed. Redpanda supports the Kafka protocol natively, including consumer groups, topic patterns, and message compression.

## Configuration

### Minimal Configuration

```typescript
const adapter = KafkaAdapter({
  brokers: ['localhost:9092'],
});
```

### Full Configuration

```typescript
import { CompressionTypes } from 'kafkajs';
import { KafkaAdapter } from '@connectum/events-kafka';

const adapter = KafkaAdapter({
  brokers: ['kafka-1:9092', 'kafka-2:9092', 'kafka-3:9092'],
  clientId: 'order-service',
  kafkaConfig: {
    connectionTimeout: 3000,
    requestTimeout: 25000,
    retry: {
      initialRetryTime: 100,
      retries: 8,
    },
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: 'user',
      password: 'password',
    },
  },
  producerOptions: {
    compression: CompressionTypes.GZIP,
  },
  consumerOptions: {
    sessionTimeout: 30000,
    fromBeginning: false,
  },
});
```

### With EventBus Middleware

```typescript
import { createEventBus } from '@connectum/events';
import { KafkaAdapter } from '@connectum/events-kafka';

const eventBus = createEventBus({
  adapter: KafkaAdapter({
    brokers: ['localhost:9092'],
    clientId: 'order-service',
  }),
  routes: [orderEvents],
  group: 'order-service',
  middleware: {
    retry: { maxRetries: 3, backoff: 'exponential', initialDelay: 1000 },
    dlq: { topic: 'order-service.dlq' },
  },
});
```

### With Server Integration

```typescript
import { createServer } from '@connectum/core';
import { createEventBus } from '@connectum/events';
import { KafkaAdapter } from '@connectum/events-kafka';

const eventBus = createEventBus({
  adapter: KafkaAdapter({ brokers: ['localhost:9092'] }),
  routes: [orderEvents],
  group: 'order-service',
});

const server = createServer({
  services: [routes],
  eventBus,
  shutdown: { autoShutdown: true },
});

await server.start();
```

## Exports Summary

| Export | Description |
|--------|-------------|
| `KafkaAdapter` | Adapter factory function |
| `KafkaAdapterOptions` | Options type (TypeScript only) |

## Related Packages

- **[@connectum/events](/en/packages/events)** -- Core EventBus, routing, middleware, MemoryAdapter (peer dependency)
- **[@connectum/events-nats](/en/packages/events-nats)** -- NATS JetStream adapter (alternative)
- **[@connectum/events-redis](/en/packages/events-redis)** -- Redis Streams adapter (alternative)
- **[@connectum/core](/en/packages/core)** -- Server with EventBus integration
