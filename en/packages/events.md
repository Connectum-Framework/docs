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
- [Adapters](/en/guide/events/adapters) -- Memory, NATS, Kafka, Redis, AMQP comparison
:::

::: tip Full API Reference
Complete TypeScript API documentation: [API Reference](/en/api/@connectum/events/)
:::

## Installation

::: pm
== npm
```bash
npm install @connectum/events
```
== pnpm
```bash
pnpm add @connectum/events
```
== bun
```bash
bun add @connectum/events
```
:::

**Peer dependency**: `@connectum/core`

You also need at least one adapter package for production use:

::: pm
== npm
```bash
# Choose one (or more) broker adapters:
npm install @connectum/events-nats    # NATS JetStream
npm install @connectum/events-kafka   # Kafka / Redpanda
npm install @connectum/events-redis   # Redis Streams / Valkey
npm install @connectum/events-amqp    # AMQP / RabbitMQ
```
== pnpm
```bash
# Choose one (or more) broker adapters:
pnpm add @connectum/events-nats    # NATS JetStream
pnpm add @connectum/events-kafka   # Kafka / Redpanda
pnpm add @connectum/events-redis   # Redis Streams / Valkey
pnpm add @connectum/events-amqp    # AMQP / RabbitMQ
```
== bun
```bash
# Choose one (or more) broker adapters:
bun add @connectum/events-nats    # NATS JetStream
bun add @connectum/events-kafka   # Kafka / Redpanda
bun add @connectum/events-redis   # Redis Streams / Valkey
bun add @connectum/events-amqp    # AMQP / RabbitMQ
```
:::

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

A minimal interface for message brokers. Each adapter (NATS, Kafka, Redis, AMQP, Memory) implements `connect(context?)`, `disconnect()`, `publish()`, and `subscribe()`. The optional `AdapterContext` parameter on `connect()` carries service-level information (like `serviceName`) derived from registered proto service descriptors, enabling adapters to identify themselves to brokers automatically. Broker-specific configuration is passed to the adapter constructor, not to the interface methods.

The named companion type `EventAdapterFactory` (`() => EventAdapter`) is the zero-argument factory shape used where a fresh adapter per consumer is needed -- most notably `createBroadcastSubscribers()`, where a factory gives each reactor bus its own broker connection. Use it to type dependency-injection seams (a service that accepts `EventAdapter | EventAdapterFactory` can take a shared instance in tests and a per-use factory in production). Available since 1.3.0.

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
| `handlerTimeout` | `number` | `30000` | Timeout in ms for event handler execution |
| `drainTimeout` | `number` | `30000` | Max ms to wait for in-flight handlers during `stop()` |
| `drainPublishTimeout` | `number` | `undefined` | Opt-in: max ms to wait for in-flight `publish()` promises during `stop()`, before the adapter disconnects. Runs concurrently with the handler drain (slower-of, never the sum). `undefined`/`0` = disabled. Available since 1.3.0 |
| `middleware` | `MiddlewareConfig` | `undefined` | Middleware configuration (retry, DLQ, custom) |
| `publishes` | `DescService[]` | `[]` | Event service descriptors this process publishes to (publisher-only, no subscription) |
| `strictTopics` | `boolean` | `false` | Throw on an unresolved publish topic instead of silently falling back to the message `typeName`. Available since 1.1.0. |

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
| `group` | `string` | `undefined` | Named group tag for workflow grouping |
| `metadata` | `Record<string, string>` | `undefined` | Additional metadata / headers |
| `messageId` | `string` | `undefined` | Caller-supplied message id the adapter sets on the wire where supported (AMQP `messageId` property; other adapters ignore it). Mainly for external-contract publishing, where the adapter does not auto-generate one. Available since 1.1.0. |
| `timestamp` | `number` | `undefined` | Caller-supplied message timestamp in Unix epoch seconds, set on the wire where supported (AMQP `timestamp` property; other adapters ignore it). Mainly for external-contract publishing. Available since 1.1.0. |

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
| `errorSerializer` | `(error: unknown) => string` | `error.name` | Custom error serializer for DLQ metadata |

### `createBroadcastSubscribers(options)`

Builds 1→N fan-out wiring: one `EventBus` per reactor, each on its own consumer group, so a single published event is delivered to every reactor independently.

Available since 1.1.0.

```typescript
function createBroadcastSubscribers(
  options: BroadcastSubscribersOptions,
): Array<EventBus & EventBusLike>;
```

Delivering one published event to N **independent** reactors requires one `EventBus` **per reactor**, each with its own consumer group:

- The per-bus duplicate-topic guard rejects two routes resolving to the same topic on one bus, so reactors cannot share a bus.
- On a real broker, a **shared** group load-balances (one reactor "steals" each event), while **distinct** groups give each reactor its own durable consumer.

`createBroadcastSubscribers()` constructs that one-bus-per-reactor wiring from a list of reactors, so callers do not hand-roll N `createEventBus()` calls. It **throws** if two reactors share a consumer group.

::: warning
The returned buses are **not started** -- start (and later stop) them yourself.
:::

```typescript
import { createBroadcastSubscribers } from '@connectum/events';
import { NatsAdapter } from '@connectum/events-nats';

// Per-bus adapter factory: each reactor bus gets its own connection / durable consumer
const buses = createBroadcastSubscribers({
  adapter: () => NatsAdapter({ servers: 'nats://localhost:4222' }),
  reactors: [
    { group: 'pricing', routes: [pricingRoutes] },
    { group: 'audit', routes: [auditRoutes] },
    { group: 'notify', routes: [notifyRoutes] },
  ],
});

await Promise.all(buses.map((bus) => bus.start()));

// On shutdown:
await Promise.all(buses.map((bus) => bus.stop()));
```

For in-process tests, pass a single shared `MemoryAdapter()` instance instead of a factory (all buses share the in-memory registry):

```typescript
import { createBroadcastSubscribers, MemoryAdapter } from '@connectum/events';

const buses = createBroadcastSubscribers({
  adapter: MemoryAdapter(), // one shared instance
  reactors: [
    { group: 'pricing', routes: [pricingRoutes] },
    { group: 'audit', routes: [auditRoutes] },
  ],
});

await Promise.all(buses.map((bus) => bus.start()));
```

### `BroadcastSubscribersOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `adapter` | `EventAdapter \| EventAdapterFactory` | *required* | One shared adapter instance (fine for `MemoryAdapter` in tests) **or** an `EventAdapterFactory` invoked once per reactor (use for real brokers so each bus gets its own connection / durable consumer). The named factory type is available since 1.3.0 |
| `reactors` | `BroadcastReactor[]` | *required* | The independent reactors -- each becomes its own `EventBus` with its own group |
| `handlerTimeout` | `number` | `30000` | Shared per-bus handler timeout in ms |
| `drainTimeout` | `number` | `30000` | Shared per-bus drain timeout in ms |
| `drainPublishTimeout` | `number` | `undefined` | Shared per-bus opt-in publish drain budget at `stop()` (ms). Available since 1.3.0 |
| `signal` | `AbortSignal` | `undefined` | Shared abort signal for graceful shutdown |

### `BroadcastReactor`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `group` | `string` | *required* | Consumer group -- MUST be distinct per reactor for true fan-out (a shared group load-balances) |
| `routes` | `EventRoute[]` | *required* | The event routes (handlers) this reactor subscribes with |
| `middleware` | `MiddlewareConfig` | `undefined` | Optional per-reactor middleware (retry / DLQ / custom) |

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

### Dependency Injection and Testing

**Primary pattern -- inject an `EventAdapter` instance.** Construct the adapter at your composition root and pass it in; a test swaps it for a double without touching the wiring:

```typescript
// Composition root (production):
const adapter = NatsAdapter({ servers: process.env.NATS_URL! });
const bus = createEventBus({ adapter, routes: [eventRoutes] });
```

```typescript
// Test: the same wiring, a different instance.
const bus = createEventBus({ adapter: MemoryAdapter(), routes: [eventRoutes] });
```

**Secondary pattern -- `EventAdapterFactory`** (`() => EventAdapter`, exported since 1.3.0): a zero-argument factory for the places where each consumer needs its **own** broker connection -- `createBroadcastSubscribers()` invokes it once per reactor. Prefer the instance elsewhere: a test double with its own configuration does not fit a zero-argument factory signature without a wrapper closure.

**Test doubles:** `MemoryAdapter` covers the generic happy path (routing, handlers, middleware, DLQ flows). Broker-specific failure semantics (typed AMQP error taxonomy, recovery/lifecycle behavior) cannot be modeled generically -- use the programmable `FakeAmqpAdapter` from the `@connectum/events-amqp/testing` subpath (since 1.3.0; see [events-amqp Testing](./events-amqp.md#testing)). For real-broker integration semantics, see each adapter package's testing notes.

### Consumer Groups

Set `group` to enable load-balanced consumption across multiple service instances:

```typescript
const eventBus = createEventBus({
  adapter: KafkaAdapter({ brokers: ['localhost:9092'] }),
  routes: [orderEvents],
  group: 'order-service', // All instances share this group
});
```

### Graceful Shutdown

`stop()` closes subscriptions, waits for in-flight **consumer handlers** up to `drainTimeout` (default 30s), force-aborts the rest via `AbortSignal`, then disconnects the adapter. Set `drainTimeout: 0` for immediate abort.

In-flight `publish()` promises are **not** tracked by the bus, and `drainTimeout` does not cover them. An at-least-once producer must settle its publishes before stopping:

```typescript
// Track publishes you must not lose:
const pending = new Set<Promise<void>>();

const p = bus.publish(OrderCreatedSchema, order);
pending.add(p);
p.catch(() => {}).finally(() => pending.delete(p));

// On shutdown — settle them BEFORE stop():
await Promise.allSettled([...pending]);
await bus.stop();
```

Two related boundaries:

- **Publishing from a draining handler is rejected** — once `stop()` begins, `publish()` throws, including from handlers that are still draining. Relay topologies (consume → transform → publish) lose the in-flight tail at shutdown; the design discussion is tracked in [connectum#212](https://github.com/Connectum-Framework/connectum/issues/212).
- **An opt-in symmetric publish drain** ships since 1.3.0: set `drainPublishTimeout` and `stop()` waits (up to that budget, concurrently with the handler drain) for publishes started before `stop()` to settle, before the adapter disconnects. A post-deadline settlement never becomes an `unhandledRejection`. Publishes issued from draining handlers stay uncovered (the stopping gate; design tracked in [connectum#212](https://github.com/Connectum-Framework/connectum/issues/212)). Note: `createServer`'s `shutdown.timeout` does not bound the bus-stopping hook — size the budget below your orchestrator's kill grace.

## Exports Summary

| Export | Description |
|--------|-------------|
| `createEventBus` | EventBus factory function |
| `createBroadcastSubscribers` | 1→N fan-out factory: one `EventBus` per reactor, each with its own consumer group, so every reactor receives every event (available since 1.1.0) |
| `deriveServiceName` | Derives a service identifier from proto service type names (format: `{packages}@{hostname}`) |
| `createEventContext` | EventContext factory (advanced) |
| `EventRouterImpl` | EventRouter implementation class |
| `MemoryAdapter` | In-memory adapter for testing |
| `retryMiddleware` | Retry middleware factory |
| `dlqMiddleware` | DLQ middleware factory |
| `composeMiddleware` | Middleware composition utility |
| `resolveTopicName` | Topic resolution from proto method descriptors |
| `matchPattern` | Wildcard pattern matching for topics |
| `NonRetryableError` | Error class that skips retry middleware |
| `RetryableError` | Error class that forces retry regardless of predicate |

### Type Exports

| Type | Description |
|------|-------------|
| `EventBus` | EventBus interface |
| `EventBusOptions` | EventBus configuration |
| `BroadcastSubscribersOptions` | Options for `createBroadcastSubscribers()` (available since 1.1.0) |
| `BroadcastReactor` | One broadcast reactor: `group` + `routes` + optional `middleware` (available since 1.1.0) |
| `AdapterContext` | Context passed to adapters on connect (contains `serviceName`) |
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
- [Adapters](/en/guide/events/adapters) -- Memory, NATS, Kafka, Redis, AMQP comparison
- [with-events-redpanda](https://github.com/Connectum-Framework/examples/tree/main/with-events-redpanda) -- Saga pattern example with Redpanda
- [with-events-dlq](https://github.com/Connectum-Framework/examples/tree/main/with-events-dlq) -- DLQ example with NATS JetStream

## Related Packages

- **[@connectum/core](./core.md)** -- Server that hosts the EventBus (peer dependency)
- **[@connectum/events-nats](/en/packages/events-nats)** -- NATS JetStream adapter
- **[@connectum/events-kafka](/en/packages/events-kafka)** -- Kafka / Redpanda adapter
- **[@connectum/events-redis](/en/packages/events-redis)** -- Redis Streams / Valkey adapter
- **[@connectum/events-amqp](/en/packages/events-amqp)** -- AMQP / RabbitMQ adapter
