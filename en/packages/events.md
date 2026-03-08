---
title: '@connectum/events'
description: Event-driven communication for Connectum microservices with pluggable broker adapters
---

# @connectum/events

Universal event adapter layer for Connectum. Provides proto-first pub/sub with pluggable broker adapters, typed event handlers mirroring ConnectRPC's router pattern, and a composable middleware pipeline with built-in retry and dead letter queue (DLQ) support.

**Layer**: 1 (Events)

::: tip Related Guides
- [Events Overview](/en/guide/events) -- architecture and core concepts
- [Getting Started](/en/guide/events/getting-started) -- step-by-step setup
- [Middleware](/en/guide/events/middleware) -- retry, DLQ, custom middleware
- [Custom Topics](/en/guide/events/custom-topics) -- proto options for topic naming
- [Adapters](/en/guide/events/adapters) -- Memory, NATS, Kafka, Redis comparison
:::

::: tip Full API Reference
Complete TypeScript API documentation: API Reference (coming soon)
:::

## Installation

```bash
pnpm add @connectum/events
```

**Peer dependency**: `@connectum/core`

You also need at least one adapter package for production use:

```bash
# Choose one (or more) broker adapters:
pnpm add @connectum/events-nats    # NATS JetStream
pnpm add @connectum/events-kafka   # Kafka / Redpanda
pnpm add @connectum/events-redis   # Redis Streams / Valkey
```

The built-in `MemoryAdapter` is included in `@connectum/events` for testing.

## Quick Start

```typescript
import { createServer } from '@connectum/core';
import { createEventBus, MemoryAdapter } from '@connectum/events';
import type { EventRoute } from '@connectum/events';
import { UserEventHandlers, UserCreatedSchema } from '#gen/user/v1/user_pb.js';

// 1. Define event handlers (mirrors ConnectRPC router pattern)
const userEvents: EventRoute = (events) => {
  events.service(UserEventHandlers, {
    onUserCreated: async (msg, ctx) => {
      console.log(`User created: ${msg.id}, ${msg.email}`);
      await ctx.ack();
    },
  });
};

// 2. Create an EventBus
const eventBus = createEventBus({
  adapter: MemoryAdapter(),
  routes: [userEvents],
  group: 'my-service',
  middleware: {
    retry: { maxRetries: 3, backoff: 'exponential' },
    dlq: { topic: 'my-service.dlq' },
  },
});

// 3. Integrate with Connectum server
const server = createServer({
  services: [routes],
  eventBus,
  shutdown: { autoShutdown: true },
});

await server.start();

// 4. Publish typed events
await eventBus.publish(UserCreatedSchema, {
  id: '123',
  email: 'alice@example.com',
  name: 'Alice',
});
```

## Core Concepts

### EventBus

The central component managing adapter lifecycle, event routes, middleware pipeline, and publishing. Created via `createEventBus()`, it implements `EventBusLike` for integration with `createServer()`.

### EventAdapter

A minimal interface for message brokers. Each adapter (NATS, Kafka, Redis, Memory) implements `connect()`, `disconnect()`, `publish()`, and `subscribe()`. Broker-specific configuration is passed to the adapter constructor, not to the interface methods.

### EventRouter

Mirrors ConnectRPC's `ConnectRouter` pattern for event handlers. Register typed handlers per proto service:

```typescript
const myEvents: EventRoute = (events) => {
  events.service(OrderEventHandlers, {
    onOrderCreated: async (msg, ctx) => { /* ... */ },
    onOrderCancelled: async (msg, ctx) => { /* ... */ },
  });
};
```

### EventContext

Per-event context passed to handlers alongside the deserialized protobuf message. Provides explicit `ack()` / `nack()` control, event metadata, and an abort signal for graceful shutdown.

## API Reference

### `createEventBus(options)`

Factory function that creates an `EventBus` instance.

```typescript
function createEventBus(options: EventBusOptions): EventBus & EventBusLike;
```

### `EventBusOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `adapter` | `EventAdapter` | *required* | Adapter instance (e.g., `NatsAdapter`, `KafkaAdapter`, `MemoryAdapter`) |
| `routes` | `EventRoute[]` | `[]` | Event routes to register |
| `group` | `string` | `undefined` | Consumer group name for load-balanced consumption |
| `signal` | `AbortSignal` | `undefined` | Abort signal for graceful shutdown |
| `handlerTimeout` | `number` | `undefined` | Timeout in ms for event handler execution |
| `middleware` | `MiddlewareConfig` | `undefined` | Middleware configuration (retry, DLQ, custom) |

### `EventBus`

| Method | Description |
|--------|-------------|
| `start()` | Connect adapter, set up subscriptions |
| `stop()` | Drain subscriptions, disconnect adapter |
| `publish(schema, data, options?)` | Publish a typed protobuf event |

### `PublishOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `topic` | `string` | `schema.typeName` | Override topic name |
| `key` | `string` | `undefined` | Partition/routing key for ordered delivery |
| `sync` | `boolean` | `false` | Wait for broker confirmation |
| `group` | `string` | `undefined` | Named group tag for workflow grouping |
| `metadata` | `Record<string, string>` | `undefined` | Additional metadata / headers |

### `EventContext`

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `signal` | `AbortSignal` | Aborted when server is shutting down |
| `eventId` | `string` | Unique event identifier |
| `eventType` | `string` | Event type / topic name |
| `publishedAt` | `Date` | When the event was published |
| `attempt` | `number` | Delivery attempt number (1-based) |
| `metadata` | `ReadonlyMap<string, string>` | Event metadata (headers) |
| `ack()` | `Promise<void>` | Acknowledge successful processing |
| `nack(requeue?)` | `Promise<void>` | Negative acknowledge -- request redelivery or send to DLQ |

### `MiddlewareConfig`

| Option | Type | Description |
|--------|------|-------------|
| `retry` | `RetryOptions` | Retry middleware configuration |
| `dlq` | `DlqOptions` | Dead letter queue configuration |
| `custom` | `EventMiddleware[]` | Custom user middleware (executed outermost) |

### `RetryOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxRetries` | `number` | `3` | Maximum retry attempts |
| `backoff` | `"exponential" \| "linear" \| "fixed"` | `"exponential"` | Backoff strategy |
| `initialDelay` | `number` | `1000` | Initial delay in ms |
| `maxDelay` | `number` | `30000` | Maximum delay in ms |
| `multiplier` | `number` | `2` | Multiplier for exponential backoff |
| `retryableErrors` | `(error: unknown) => boolean` | `undefined` | Filter: only retry matching errors |

### `DlqOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `topic` | `string` | *required* | DLQ topic name |
| `errorSerializer` | `(error: unknown) => Record<string, unknown>` | `undefined` | Custom error serializer for DLQ metadata |

## Middleware

The middleware pipeline uses an onion model (outer to inner):

```
Custom → DLQ → Retry → Handler
```

- **Custom middleware** runs outermost, wrapping everything
- **DLQ** catches errors after all retries are exhausted and publishes to a dead letter topic
- **Retry** catches handler errors and retries with configurable backoff

See [Middleware Guide](/en/guide/events/middleware) for detailed configuration and custom middleware examples.

## Configuration

### Integration with createServer

Pass the `eventBus` to `createServer()` for automatic lifecycle management:

```typescript
const server = createServer({
  services: [routes],
  eventBus,
  shutdown: { autoShutdown: true },
});
```

The server calls `eventBus.start()` on startup and `eventBus.stop()` on shutdown.

### Consumer Groups

Set `group` to enable load-balanced consumption across multiple service instances:

```typescript
const eventBus = createEventBus({
  adapter: KafkaAdapter({ brokers: ['localhost:9092'] }),
  routes: [orderEvents],
  group: 'order-service', // All instances share this group
});
```

## Exports Summary

| Export | Description |
|--------|-------------|
| `createEventBus` | EventBus factory function |
| `createEventContext` | EventContext factory (advanced) |
| `EventRouterImpl` | EventRouter implementation class |
| `MemoryAdapter` | In-memory adapter for testing |
| `retryMiddleware` | Retry middleware factory |
| `dlqMiddleware` | DLQ middleware factory |
| `composeMiddleware` | Middleware composition utility |
| `resolveTopicName` | Topic resolution from proto method descriptors |
| `matchPattern` | Wildcard pattern matching for topics |

### Type Exports

| Type | Description |
|------|-------------|
| `EventBus` | EventBus interface |
| `EventBusOptions` | EventBus configuration |
| `EventAdapter` | Adapter interface |
| `EventRouter` | Router interface |
| `EventRoute` | Route function type |
| `EventContext` | Per-event context |
| `EventMiddleware` | Middleware function type |
| `PublishOptions` | Publish options |
| `RetryOptions` | Retry middleware options |
| `DlqOptions` | DLQ middleware options |
| `MiddlewareConfig` | Built-in middleware configuration |
| `RawEvent` | Raw event data from adapter |
| `ServiceEventHandlers` | Typed handler map for a service |
| `TypedEventHandler` | Typed handler function |

## Learn More

- [Events Overview](/en/guide/events) -- architecture and design decisions
- [Getting Started](/en/guide/events/getting-started) -- step-by-step tutorial
- [Custom Topics](/en/guide/events/custom-topics) -- proto options for topic naming
- [Middleware](/en/guide/events/middleware) -- retry, DLQ, custom middleware
- [Adapters](/en/guide/events/adapters) -- Memory, NATS, Kafka, Redis comparison
- [with-events-redpanda](https://github.com/Connectum-Framework/examples/tree/main/with-events-redpanda) -- Saga pattern example with Redpanda
- [with-events-dlq](https://github.com/Connectum-Framework/examples/tree/main/with-events-dlq) -- DLQ example with NATS JetStream

## Related Packages

- **[@connectum/core](./core.md)** -- Server that hosts the EventBus (peer dependency)
- **[@connectum/events-nats](/en/packages/events-nats)** -- NATS JetStream adapter
- **[@connectum/events-kafka](/en/packages/events-kafka)** -- Kafka / Redpanda adapter
- **[@connectum/events-redis](/en/packages/events-redis)** -- Redis Streams / Valkey adapter
