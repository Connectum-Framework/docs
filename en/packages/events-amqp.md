---
title: '@connectum/events-amqp'
description: AMQP / RabbitMQ adapter for @connectum/events EventBus
---

# @connectum/events-amqp

AMQP 0-9-1 adapter for the Connectum EventBus. Provides persistent at-least-once delivery through [RabbitMQ](https://www.rabbitmq.com/) (or compatible brokers like [LavinMQ](https://lavinmq.com/)) using topic exchanges, competing consumers, dead letter exchanges, explicit external topology, automatic connection recovery, per-message publisher confirms, and metadata propagation via AMQP message headers.

**Layer**: 2 (Broker Adapters)

::: tip Related Guides
- [Events Overview](/en/guide/events) -- event-driven architecture with Connectum
- [Adapters Comparison](/en/guide/events/adapters) -- choosing between NATS, Kafka, Redis, AMQP, and in-memory adapters
- [@connectum/events](/en/packages/events) -- core EventBus API and routing
:::

::: tip Full API Reference
Complete TypeScript API documentation: [API Reference](/en/api/@connectum/events-amqp/)
:::

## Installation

```bash
pnpm add @connectum/events-amqp
```

**Peer dependency**: `@connectum/events`

**Transitive dependency**: [amqplib](https://www.npmjs.com/package/amqplib) `^2.0.1` (installed automatically; v2 provides native connection recovery)

## Quick Start

```typescript
import { createEventBus } from '@connectum/events';
import { AmqpAdapter } from '@connectum/events-amqp';

const adapter = AmqpAdapter({
  url: 'amqp://guest:guest@localhost:5672',
});

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

### `AmqpAdapter(options)`

Factory function that creates an `EventAdapter` for AMQP 0-9-1 brokers (RabbitMQ, LavinMQ).

```typescript
function AmqpAdapter(options: AmqpAdapterOptions): EventAdapter;
```

Pass the result to `createEventBus({ adapter })`.

### `AmqpAdapterOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | `string` | *(required)* | AMQP connection URL (e.g., `"amqp://guest:guest@localhost:5672"`) |
| `socketOptions` | `Record<string, unknown>` | `undefined` | Low-level socket options passed to `amqplib.connect()` (TLS certificates, timeouts) |
| `exchange` | `string` | `"connectum.events"` | Exchange name. Created automatically on `connect()` if it does not exist (in `assert` mode) |
| `exchangeType` | `"topic" \| "direct" \| "fanout" \| "headers"` | `"topic"` | Exchange type. `"topic"` enables wildcard routing keys |
| `exchangeOptions` | `AmqpExchangeOptions` | `undefined` | Exchange declaration options |
| `queueOptions` | `AmqpQueueOptions` | `undefined` | Default queue declaration options |
| `consumerOptions` | `AmqpConsumerOptions` | `undefined` | Consumer tuning options |
| `publisherOptions` | `AmqpPublisherOptions` | `undefined` | Publisher tuning options |
| `serialization` | `AmqpSerializationOptions` | `undefined` | `contentType` label and optional wire transcoding |
| `topology` | `AmqpTopology` | `undefined` | Explicit topology declared on connect (and re-applied after recovery) |
| `topologyMode` | `"assert" \| "check" \| "skip"` | `"assert"` | How topology is established |
| `queueOverrides` | `Record<string, AmqpQueueOverride>` | `undefined` | Map a consumer group to an externally named queue |
| `recovery` | `boolean \| AmqpRecoveryOptions` | `true` | Automatic connection recovery (amqplib native); `false` disables |
| `lifecycle` | `AmqpLifecycleCallbacks` | `undefined` | Connection lifecycle callbacks |
| `publishTimeoutMs` | `number` | `30000` | Per-publish broker-outcome deadline in milliseconds |

### `AmqpExchangeOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `durable` | `boolean` | `true` | Survive broker restarts |
| `autoDelete` | `boolean` | `false` | Delete exchange when all queues unbind |

### `AmqpQueueOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `durable` | `boolean` | `true` | Survive broker restarts (persists queue metadata) |
| `messageTtl` | `number` | `undefined` | Per-queue message time-to-live in milliseconds |
| `maxLength` | `number` | `undefined` | Maximum number of messages in the queue |
| `deadLetterExchange` | `string` | `undefined` | Exchange to route rejected/expired messages to |
| `deadLetterRoutingKey` | `string` | `undefined` | Routing key used when publishing to the dead letter exchange |

### `AmqpConsumerOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prefetch` | `number` | `10` | Channel-level prefetch count (`QoS`). Controls how many unacknowledged messages a consumer receives at once |
| `exclusive` | `boolean` | `false` | Exclusive consumer -- only this connection can consume from the queue |

### `AmqpPublisherOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `persistent` | `boolean` | `true` | Mark messages as persistent (`deliveryMode: 2`). Messages survive broker restarts when the queue is durable |
| `mandatory` | `boolean` | `false` | Reject the publish with `AmqpUnroutableError` when the broker cannot route the message to any queue |
| `correlationHeader` | `boolean` | `true` | Correlate `basic.return` frames to mandatory publishes via a private `x-connectum-publish-id` header (visible on the wire); `false` switches to single-flight serialization of mandatory publishes |
| `externalContract` | `boolean` | `false` | Publish against an external (non-EventBus) contract: suppress the EventBus envelope so the frame carries only contract-specified properties — no `x-event-id` / `x-published-at` headers, no auto `messageId` / `timestamp`, and `mandatory` uses single-flight correlation (so no `x-connectum-publish-id` reaches the wire; `correlationHeader` is ignored). The frame then carries only `contentType`, `persistent`, `mandatory`, and the headers passed via `PublishOptions.metadata`. Set a contract-required `messageId` / `timestamp` per-publish via `PublishOptions`. Available since 1.1.0. |

### `AmqpSerializationOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `contentType` | `string` | `"application/protobuf"` | AMQP `contentType` message property |
| `encode` | `(payload: Uint8Array) => Uint8Array` | `undefined` | Transform the outgoing wire body. Failures reject the publish with `AmqpSerializationError` |
| `decode` | `(content: Uint8Array) => Uint8Array` | `undefined` | Transform the incoming wire body before it reaches the handler. Failures nack the message without requeue (DLX or drop) |

::: info contentType is a label, not a converter
The adapter receives payloads as bytes -- the EventBus serializes protobuf upstream. Setting `contentType: "application/json"` does not make the EventBus emit JSON. For external JSON contracts the application serializes JSON itself, publishes the pre-serialized bytes through the adapter directly, and sets `contentType` to match. See [External AMQP Contract](#external-amqp-contract).
:::

### `AmqpTopology`

Declarative topology applied on `connect()` and re-applied after every recovery:

| Field | Type | Description |
|-------|------|-------------|
| `exchanges` | `AmqpExchangeDeclaration[]` | Exchanges: `name`, `type`, `durable`, `autoDelete`, raw `arguments` passthrough |
| `queues` | `AmqpQueueDeclaration[]` | Queues: `name`, `durable`, `autoDelete`, `exclusive`, raw `arguments` passthrough (e.g. `x-dead-letter-exchange`) |
| `bindings` | `AmqpBindingDeclaration[]` | Bindings from a `source` exchange with a `routingKey` to either a destination `queue` or a destination `exchange` (exchange-to-exchange) |

::: warning Topology queues and subscribe()
Queues declared in `topology.queues` are asserted once with their full arguments when topology is applied. `subscribe()` does **not** re-assert them -- it only binds the subscription patterns. Re-asserting without the original arguments would be a conflicting redeclare (`PRECONDITION_FAILED` 406).
:::

### Topology Modes

| Mode | Behavior |
|------|----------|
| `"assert"` *(default)* | Declare topology idempotently (`assertExchange` / `assertQueue` / bind) |
| `"check"` | Existence-only verification (`checkExchange` / `checkQueue`); fails fast with `AmqpTopologyError` on missing objects |
| `"skip"` | No topology operations at all; the application owns topology |

::: warning check mode verifies existence only
AMQP offers no passive introspection: `"check"` mode confirms that exchanges and queues *exist*, but argument equivalence and binding presence are NOT verifiable. A conflicting redeclare made elsewhere still fails with `PRECONDITION_FAILED` (406).
:::

### `AmqpQueueOverride`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `queue` | `string` | *(required)* | Externally defined queue name to consume from |
| `arguments` | `Record<string, unknown>` | `undefined` | Raw AMQP arguments used when asserting the queue (`assert` mode only) |
| `durable` | `boolean` | `true` | Queue durability |

By default a consumer group consumes from `${exchange}.${group}`. A `queueOverrides` entry attaches the subscription to a queue from an external contract instead:

```typescript
const adapter = AmqpAdapter({
  url: 'amqp://localhost:5672',
  queueOverrides: {
    partner: { queue: 'partner.inbound.v1' },
  },
});
// group "partner" now consumes from "partner.inbound.v1"
```

### `AmqpRecoveryOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialDelay` | `number` | `100` | First reconnect delay in ms |
| `maxDelay` | `number` | `30000` | Delay cap in ms |
| `factor` | `number` | `2` | Exponential backoff factor |
| `jitter` | `number` | `0.2` | Randomization factor (0..1) |
| `maxRetries` | `number` | `Infinity` | Give up after this many attempts |

### `AmqpLifecycleCallbacks`

| Callback | Signature | Fires when |
|----------|-----------|------------|
| `onConnected` | `() => void` | Connection established (initial connect and after each recovery) |
| `onDisconnected` | `(cause: Error) => void` | Connection lost |
| `onReconnecting` | `(info: { attempt: number; delay: number; error: Error }) => void` | A reconnect attempt is scheduled |
| `onReconnectFailed` | `(cause: Error) => void` | Recovery exhausted (`maxRetries` reached) |

Connection errors are surfaced through these callbacks -- never console-only.

## Configuration Examples

### Minimal

```typescript
const adapter = AmqpAdapter({
  url: 'amqp://localhost:5672',
});
```

### Full Configuration

```typescript
const adapter = AmqpAdapter({
  url: 'amqp://user:password@rabbitmq.example.com:5672/my-vhost',
  exchange: 'orders.events',
  exchangeType: 'topic',
  exchangeOptions: {
    durable: true,
    autoDelete: false,
  },
  queueOptions: {
    durable: true,
    messageTtl: 86_400_000,        // 24 hours
    maxLength: 1_000_000,
    deadLetterExchange: 'orders.dlx',
    deadLetterRoutingKey: 'orders.dead',
  },
  consumerOptions: {
    prefetch: 50,
    exclusive: false,
  },
  publisherOptions: {
    persistent: true,
    mandatory: false,
  },
  recovery: {
    initialDelay: 100,
    maxDelay: 30_000,
    factor: 2,
    jitter: 0.2,
  },
  lifecycle: {
    onConnected: () => console.log('AMQP connected'),
    onDisconnected: (cause) => console.error('AMQP disconnected', cause),
    onReconnecting: ({ attempt, delay }) => console.warn(`Reconnect #${attempt} in ${delay}ms`),
    onReconnectFailed: (cause) => console.error('AMQP recovery exhausted', cause),
  },
  publishTimeoutMs: 30_000,
});
```

### TLS Connection

```typescript
import { readFileSync } from 'node:fs';

const adapter = AmqpAdapter({
  url: 'amqps://user:password@rabbitmq.example.com:5671',
  socketOptions: {
    cert: readFileSync('/path/to/client-cert.pem'),
    key: readFileSync('/path/to/client-key.pem'),
    ca: [readFileSync('/path/to/ca-cert.pem')],
    rejectUnauthorized: true,
  },
});
```

### Virtual Host (vhost)

AMQP virtual hosts provide logical isolation within a single broker. Specify the vhost in the URL path:

```typescript
// Default vhost "/"
const adapter = AmqpAdapter({ url: 'amqp://localhost:5672' });

// Named vhost
const adapter = AmqpAdapter({ url: 'amqp://user:pass@localhost:5672/production' });

// URL-encoded vhost (if name contains special characters)
const adapter = AmqpAdapter({ url: 'amqp://user:pass@localhost:5672/%2Fmy-vhost' });
```

### LavinMQ

[LavinMQ](https://lavinmq.com/) is a lightweight, high-performance AMQP 0-9-1 broker compatible with RabbitMQ. The `AmqpAdapter` works with LavinMQ without modification:

```typescript
const adapter = AmqpAdapter({
  url: 'amqp://guest:guest@lavinmq-host:5672',
});
```

## External AMQP Contract

A complete recipe for integrating with an externally defined AMQP contract (AsyncAPI-style): direct exchange, named durable queue with DLQ arguments, JSON `contentType`, mandatory routing, and per-message confirms. The application serializes JSON itself and publishes through the adapter directly:

```typescript
import { AmqpAdapter, AmqpUnroutableError } from '@connectum/events-amqp';

const adapter = AmqpAdapter({
  url: 'amqp://broker:5672',
  exchange: 'partner.direct',
  exchangeType: 'direct',
  serialization: { contentType: 'application/json' },
  topology: {
    exchanges: [{ name: 'partner.dlx', type: 'direct' }],
    queues: [
      { name: 'partner.dead.v1', durable: true },
      {
        name: 'partner.inbound.v1',
        durable: true,
        arguments: {
          'x-dead-letter-exchange': 'partner.dlx',
          'x-dead-letter-routing-key': 'inbound.dead',
        },
      },
    ],
    bindings: [
      { queue: 'partner.dead.v1', source: 'partner.dlx', routingKey: 'inbound.dead' },
      { queue: 'partner.inbound.v1', source: 'partner.direct', routingKey: 'inbound' },
    ],
  },
  queueOverrides: {
    partner: { queue: 'partner.inbound.v1' },
  },
  // externalContract: emit ONLY contract-specified properties -- suppress the
  // EventBus envelope (no x-event-id / x-published-at, no auto messageId /
  // timestamp, no x-connectum-publish-id). Available since 1.1.0.
  publisherOptions: { persistent: true, mandatory: true, externalContract: true },
});

await adapter.connect();

// Consume from the external queue (group "partner" → partner.inbound.v1)
await adapter.subscribe(
  ['inbound'],
  async (event, ack) => {
    const message = JSON.parse(new TextDecoder().decode(event.payload));
    // ...
    await ack();
  },
  { group: 'partner' },
);

// Publish pre-serialized JSON bytes; resolves on broker ack,
// rejects with AmqpUnroutableError if no queue is bound
const body = new TextEncoder().encode(JSON.stringify({ code: '0104603...' }));
await adapter.publish('inbound', body);
```

::: tip Keeping the external wire contract-pure
`externalContract: true` (set above) is what keeps the frame contract-only: it suppresses the EventBus envelope (`x-event-id` / `x-published-at`), skips the auto `messageId` / `timestamp`, and serializes `mandatory` publishes single-flight so no private `x-connectum-publish-id` header reaches the wire (`correlationHeader` is ignored in this mode). The frame then carries only `contentType`, `persistent`, `mandatory`, and the headers you pass via `PublishOptions.metadata`; set a contract-required `messageId` / `timestamp` per-publish via [`PublishOptions`](/en/packages/events#publishoptions).

Without `externalContract`, a `mandatory` publish at the default `correlationHeader: true` carries the wire-visible `x-connectum-publish-id` header (setting `correlationHeader: false` removes only that header -- the envelope headers are still stamped). Prefer `externalContract` for a genuinely contract-only wire. Available since 1.1.0.
:::

## Reliable Publishing

The adapter publishes on a confirm channel with **per-message confirms**: every `publish()` resolves when the broker acknowledges that specific message and rejects when the broker nacks it. There is no confirm batching -- each publish has its own outcome.

- No broker outcome (ack/nack/return/connection loss) within `publishTimeoutMs` (default 30000 ms) → rejects with `AmqpPublishTimeoutError`. The message state is UNKNOWN -- it may or may not have been routed; an at-least-once producer should republish.
- Publishing during a disconnected window (or while recovery is in progress) fails fast with `AmqpConnectionError`. In-flight publishes at the moment of a connection loss also reject with `AmqpConnectionError`.
- With `mandatory: true`, an unroutable message rejects with `AmqpUnroutableError` (carries `.routingKey`).

::: tip Per-message confirms
Confirms are always per-message: every `publish()` resolves on its own broker ack (or rejects with a typed error). There is no fire-and-forget mode. The legacy `PublishOptions.sync` flag was removed from `@connectum/events` ahead of the first stable release.
:::

### Error Taxonomy

Every terminal publish/topology outcome is distinguishable by error class -- what an at-least-once producer needs for an "advance cursor after confirm" pattern:

| Error | Meaning |
|-------|---------|
| `AmqpAdapterError` | Base class for all adapter errors |
| `AmqpConnectionError` | Connection absent, lost, or recovery in progress / exhausted |
| `AmqpUnroutableError` | Broker returned a `mandatory` message as unroutable (`basic.return`); has `.routingKey` |
| `AmqpPublishNackError` | Broker negatively acknowledged (nacked) a published message |
| `AmqpPublishTimeoutError` | No broker outcome within `publishTimeoutMs`; message state UNKNOWN |
| `AmqpTopologyError` | Topology declaration or verification failed (missing object in `check` mode, conflicting redeclare in `assert` mode) |
| `AmqpSerializationError` | Payload encoding failed in a custom `serialization.encode` hook |

## Connection Recovery

Recovery is delegated to amqplib v2 native opt-in recovery and is **enabled by default**. Pass `recovery: false` to restore single-shot, no-reconnect behavior, or pass an `AmqpRecoveryOptions` object to tune the backoff.

On every successful (re)connect the adapter:

1. Re-creates its publish and consumer channels.
2. Re-applies topology (per `topologyMode`).
3. Replays all active subscriptions.

Connection behavior:

- **With recovery enabled**, `connect()` retries with backoff until the broker becomes reachable -- convenient for `docker-compose` startup ordering where the broker may not be up yet.
- **With `recovery: false`**, `connect()` rejects immediately if the broker is unreachable, and a lost connection is not restored.

Observe connection state through the `lifecycle` callbacks (`onConnected`, `onDisconnected`, `onReconnecting`, `onReconnectFailed`).

## Adapter Lifecycle

The `AmqpAdapter` follows the `EventAdapter` interface lifecycle managed by `createEventBus()`:

```
connect() → publish() / subscribe() → disconnect()
```

| Method | Description |
|--------|-------------|
| `connect(context?)` | Opens an AMQP connection (retrying per recovery policy), creates the confirm channel, applies topology. Uses `context.serviceName` as `clientProperties.connection_name` if not set explicitly. |
| `disconnect()` | Cancels all active consumers, closes channels and the connection |
| `publish()` | Publishes a serialized event to the exchange with `eventType` as the routing key; resolves on the broker's per-message confirm. Metadata is propagated as AMQP message headers |
| `subscribe()` | Declares queues (named, auto-delete, or contract-overridden), binds them to the exchange with topic patterns, and starts consuming with explicit ack/nack |

::: info Automatic Exchange Creation
On `connect()`, the adapter asserts the configured exchange (default: `"connectum.events"` with type `"topic"`) plus any explicit `topology` -- in the default `"assert"` mode. If your topology is provisioned externally (RabbitMQ management, IaC), use `topologyMode: "check"` to fail fast on missing objects, or `"skip"` to perform no topology operations at all.
:::

## AMQP Concepts

Understanding a few AMQP concepts helps configure the adapter effectively:

### Exchanges

An **exchange** receives published messages and routes them to bound queues based on the routing key and exchange type. The adapter uses a `topic` exchange by default, which supports wildcard routing patterns.

### Queues

A **queue** stores messages until they are consumed. The adapter creates queues automatically:
- **With `group`**: named queue `{exchange}.{group}` -- durable, shared across instances (competing consumers)
- **With `group` + `queueOverrides[group]`**: the externally named queue from the override (external contract)
- **Without `group`**: anonymous auto-delete queue -- exclusive to this consumer, deleted on disconnect

### Routing Keys

Events are published with `eventType` as the routing key. For example, publishing a `user.created` event results in the AMQP routing key `user.created`.

### Wildcard Binding

When using a `topic` exchange, AMQP supports two wildcard tokens in binding patterns:

| EventBus Pattern | AMQP Binding Key | Description |
|------------------|------------------|-------------|
| `user.created` | `user.created` | Exact match |
| `user.*` | `user.*` | Matches exactly one word (`user.created`, `user.deleted`) |
| `user.>` | `user.#` | Matches zero or more words (`user`, `user.created`, `user.profile.updated`) |

The adapter translates `>` (EventBus multi-segment wildcard) to `#` (AMQP multi-word wildcard) automatically.

### Consumer Groups (Competing Consumers)

When a `group` name is set on the EventBus, all instances sharing the same group bind to the same named queue. RabbitMQ distributes messages round-robin across consumers on that queue, ensuring each message is processed by exactly one instance.

```typescript
// Two instances share load for order events
const bus = createEventBus({
  adapter: AmqpAdapter({ url: 'amqp://localhost:5672' }),
  routes: [orderRoutes],
  group: 'order-service', // Same group = competing consumers
});
```

### Dead Letter Exchange (DLX)

AMQP natively supports dead letter exchanges. When a message is rejected (`nack` without requeue) or expires, RabbitMQ routes it to the configured dead letter exchange:

```typescript
const adapter = AmqpAdapter({
  url: 'amqp://localhost:5672',
  queueOptions: {
    deadLetterExchange: 'my-service.dlx',
    deadLetterRoutingKey: 'my-service.dead',
  },
});
```

For externally defined DLQ topologies, declare the queue with raw arguments instead (see [External AMQP Contract](#external-amqp-contract)).

This works alongside the EventBus-level DLQ middleware. For broker-native DLQ handling, configure `queueOptions.deadLetterExchange`. For application-level DLQ, use the `middleware.dlq` option in `createEventBus()`.

### At-Least-Once Delivery

The adapter uses **manual acknowledgment** (AMQP `noAck: false`). Each message must be acknowledged by the handler. If the handler throws an error, the message is negatively acknowledged (`nack`) and requeued for redelivery (subject to `maxDeliver` / retry limits). A message that fails a custom `serialization.decode` hook is nacked without requeue (DLX or drop) -- a payload that cannot be decoded will never succeed.

### Delivery Attempts

AMQP does not natively track delivery attempt counts. The adapter infers the attempt number from the `redelivered` flag on the message:
- `redelivered: false` → `attempt: 1` (first delivery)
- `redelivered: true` → `attempt: 2` (redelivery)

For fine-grained retry control, use the EventBus retry middleware which tracks attempts independently.

## Metadata Propagation

Event metadata is transmitted as AMQP message headers, enabling cross-service context propagation:

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

Internal headers (`x-event-id`, `x-published-at`, `x-connectum-publish-id`) are set by the adapter on publish and stripped from metadata on delivery.

## Exports Summary

| Export | Description |
|--------|-------------|
| `AmqpAdapter` | Factory function that creates an AMQP adapter |
| `toAmqpPattern` | Converts EventBus wildcard pattern (`>`) to AMQP routing key pattern (`#`) |
| `AmqpTopologyMode` | Topology mode constants (`ASSERT` / `CHECK` / `SKIP`) |
| `AmqpAdapterError` | Base class for all adapter errors |
| `AmqpConnectionError` | Connection absent, lost, or recovery in progress / exhausted |
| `AmqpUnroutableError` | Mandatory message returned as unroutable (has `.routingKey`) |
| `AmqpPublishNackError` | Broker nacked a published message |
| `AmqpPublishTimeoutError` | No broker outcome within `publishTimeoutMs` |
| `AmqpTopologyError` | Topology declaration or verification failed |
| `AmqpSerializationError` | Payload encoding/decoding failed in a custom hook |
| `AmqpAdapterOptions` | Configuration options type |
| `AmqpExchangeOptions` | Exchange declaration options type |
| `AmqpQueueOptions` | Queue declaration options type |
| `AmqpConsumerOptions` | Consumer tuning options type |
| `AmqpPublisherOptions` | Publisher tuning options type |
| `AmqpSerializationOptions` | Serialization options type |
| `AmqpTopology` | Declarative topology type (with `AmqpExchangeDeclaration`, `AmqpQueueDeclaration`, `AmqpBindingDeclaration`) |
| `AmqpQueueOverride` | External queue override type |
| `AmqpRecoveryOptions` | Recovery backoff options type |
| `AmqpLifecycleCallbacks` | Connection lifecycle callbacks type |

## Related Packages

- **[@connectum/events](./events.md)** -- Core EventBus API, routing, and middleware (peer dependency)
- **[@connectum/events-nats](./events-nats.md)** -- NATS JetStream adapter alternative
- **[@connectum/events-kafka](./events-kafka.md)** -- Kafka / Redpanda adapter alternative
- **[@connectum/events-redis](./events-redis.md)** -- Redis Streams adapter alternative
- **[@connectum/core](./core.md)** -- Server framework for hosting services alongside the event bus

## Learn More

- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html) -- official RabbitMQ reference
- [amqplib Documentation](https://amqp-node.github.io/amqplib/) -- underlying Node.js client library
- [LavinMQ](https://lavinmq.com/) -- lightweight AMQP 0-9-1 compatible broker
- [ADR-026](/en/contributing/adr/026-eventbus-architecture) -- architectural decision for the EventBus design
