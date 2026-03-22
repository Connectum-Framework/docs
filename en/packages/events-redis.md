---
title: '@connectum/events-redis'
description: Redis Streams adapter for @connectum/events EventBus
---

# @connectum/events-redis

Redis Streams / [Valkey](https://valkey.io/) adapter for the Connectum EventBus. Uses Redis Streams primitives (`XADD`, `XREADGROUP`, `XACK`) via [ioredis](https://github.com/redis/ioredis) to provide durable, ordered event delivery with consumer groups.

**Layer**: 2 (Broker Adapters)

::: tip Related Guides
- [Events Overview](/en/guide/events) -- EventBus architecture and concepts
- [Adapters Comparison](/en/guide/events/adapters) -- choosing the right adapter
- [@connectum/events](/en/packages/events) -- core EventBus package
:::

::: tip Full API Reference
Complete TypeScript API documentation: API Reference (coming soon)
:::

## Installation

```bash
pnpm add @connectum/events-redis
```

**Peer dependency**: `@connectum/events`

**Runtime dependency**: `ioredis` (installed automatically)

## Quick Start

```typescript
import { createEventBus } from '@connectum/events';
import { RedisAdapter } from '@connectum/events-redis';

const bus = createEventBus({
  adapter: RedisAdapter({ url: 'redis://localhost:6379' }),
  routes: [myEventRoutes],
  group: 'my-service',
});

await bus.start();

// Publish an event
await bus.publish(UserCreatedSchema, { userId: '123', email: 'user@example.com' });

// When shutting down
await bus.stop();
```

## API Reference

### `RedisAdapter(options?)`

Factory function that creates an `EventAdapter` for Redis Streams.

```typescript
function RedisAdapter(options?: RedisAdapterOptions): EventAdapter;
```

Pass the result to `createEventBus({ adapter: ... })`.

### `RedisAdapterOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | `string` | `undefined` | Redis connection URL (e.g., `"redis://localhost:6379"`). Takes precedence over `redisOptions.host` / `redisOptions.port` when both are provided. |
| `redisOptions` | `RedisOptions` (ioredis) | `undefined` | Redis connection options passed directly to `new Redis()`. When `url` is also set, these options are merged as the second argument. If `connectionName` is not set, it defaults to the service name derived from proto descriptors (e.g., `order.v1@pod-abc123`), which appears in `CLIENT LIST` output. See [Automatic Client Identification](/en/guide/events/adapters#automatic-client-identification). |
| `brokerOptions` | `RedisBrokerOptions` | `undefined` | Broker-specific tuning for Redis Streams consumption. |

### `RedisBrokerOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxLen` | `number` | `undefined` (no limit) | Maximum stream length (MAXLEN approximate for XADD). When set, older entries are trimmed on publish. |
| `blockMs` | `number` | `5000` | Block timeout in milliseconds for `XREADGROUP`. How long the consumer blocks waiting for new messages before retrying the loop. |
| `count` | `number` | `10` | Number of messages to read per `XREADGROUP` call. |

### Connection Modes

You can connect to Redis using a URL, explicit options, or both:

```typescript
// URL only
RedisAdapter({ url: 'redis://localhost:6379' });

// Options only (ioredis RedisOptions)
RedisAdapter({
  redisOptions: {
    host: '10.0.0.1',
    port: 6380,
    password: 'secret',
    db: 2,
    tls: {},
  },
});

// URL with additional options merged
RedisAdapter({
  url: 'redis://localhost:6379',
  redisOptions: { password: 'secret', db: 2 },
});

// Default (localhost:6379, no auth)
RedisAdapter();
```

## Redis Streams Concepts

The adapter maps EventBus operations to Redis Streams primitives:

| EventBus Operation | Redis Command | Description |
|--------------------|---------------|-------------|
| `publish()` | `XADD` | Appends event to a stream with auto-generated entry ID |
| `subscribe()` | `XREADGROUP` | Reads from stream as part of a consumer group (blocking) |
| Acknowledgment | `XACK` | Confirms successful processing, removes from pending |

### Stream Keys

Event types are mapped to stream keys with the `events:` prefix:

```
Event type:  "user.created"
Stream key:  "events:user.created"
```

### Consumer Groups

Each subscription creates a Redis consumer group. When a `group` name is provided via `EventBusOptions`, all instances sharing the same group name form a competing-consumers pattern -- each message is delivered to exactly one consumer in the group.

```typescript
// Two instances share load for "user.created" events
const bus = createEventBus({
  adapter: RedisAdapter({ url: 'redis://localhost:6379' }),
  routes: [userRoutes],
  group: 'user-service', // Same group = load-balanced
});
```

### Message Acknowledgment

Messages are acknowledged (`XACK`) only after successful handler execution. If a handler throws, the message remains in the pending entries list (PEL) for redelivery.

### Blocking Connections

Each subscription creates a dedicated blocking connection via `redis.duplicate()`. This prevents the blocking `XREADGROUP` call from interfering with the main connection used for publishing.

## Valkey Compatibility

[Valkey](https://valkey.io/) is an open-source fork of Redis that maintains full protocol compatibility. The adapter works with Valkey out of the box -- no configuration changes required:

```typescript
// Works identically with Valkey
RedisAdapter({ url: 'redis://valkey-host:6379' });
```

## Configuration

### Stream Trimming

Use `maxLen` to cap stream size and prevent unbounded memory growth:

```typescript
RedisAdapter({
  url: 'redis://localhost:6379',
  brokerOptions: {
    maxLen: 100_000, // Keep approximately 100k entries per stream
  },
});
```

::: info
The adapter uses approximate trimming (`MAXLEN ~`) for better performance. Redis may keep slightly more entries than the specified limit.
:::

### Tuning Consumption

Adjust `blockMs` and `count` to balance latency and throughput:

```typescript
RedisAdapter({
  url: 'redis://localhost:6379',
  brokerOptions: {
    blockMs: 2000, // Lower = more responsive, higher CPU usage
    count: 50,     // Higher = better throughput, more memory per batch
  },
});
```

| Scenario | `blockMs` | `count` | Notes |
|----------|-----------|---------|-------|
| Low latency | `1000` | `1` | Fastest response, higher CPU |
| Balanced (default) | `5000` | `10` | Good for most workloads |
| High throughput | `5000` | `100` | Batch processing, higher memory per iteration |

### Event Metadata

You can attach metadata to published events. Metadata fields are stored as `meta:key` fields in the Redis Stream entry:

```typescript
await bus.publish(OrderCreatedSchema, order, {
  metadata: {
    'trace-id': traceId,
    'source': 'order-service',
  },
});
```

Metadata is available in event handlers via `ctx.metadata`:

```typescript
const routes: EventRoute = (events) => {
  events.service(OrderEventHandlers, {
    async onOrderCreated(event, ctx) {
      const traceId = ctx.metadata.get('trace-id');
      // ...
    },
  });
};
```

## Exports Summary

| Export | Kind | Description |
|--------|------|-------------|
| `RedisAdapter` | Function | Factory that creates a Redis Streams `EventAdapter` |
| `RedisAdapterOptions` | Type | Configuration options for the adapter |
| `RedisBrokerOptions` | Type | Redis Streams broker tuning options |

## Related Packages

- **[@connectum/events](/en/packages/events)** -- Core EventBus that hosts this adapter (peer dependency)
- **[@connectum/events-nats](/en/packages/events-nats)** -- NATS JetStream adapter (alternative)
- **[@connectum/events-kafka](/en/packages/events-kafka)** -- Apache Kafka adapter (alternative)
- **[@connectum/events-amqp](/en/packages/events-amqp)** -- AMQP / RabbitMQ adapter (alternative)
