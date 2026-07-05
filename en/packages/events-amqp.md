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
| `failFastOnInitialSetupError` | `boolean` | `false` | Reject `connect()` with the typed `AmqpTopologyError` on a deterministic setup/topology error at the **first** connect, instead of hanging in infinite recovery. Transient broker-unreachable still blocks-and-retries. Available since 1.2.0 |
| `treatTopologyErrorAsFatal` | `boolean` | `false` | Stop the reconnect cycle on **deterministic** topology drift during steady-state recovery (AMQP reply code `404`/`406` on the cause) instead of retrying forever; reports terminal `reconnect-failed` after `setup-failed` and tears down fully. Transient causes stay in recovery. Available since 1.3.0 |
| `lifecycle` | `AmqpLifecycleCallbacks` | `undefined` | Connection lifecycle callbacks |
| `publishTimeoutMs` | `number` | `30000` | Per-publish broker-outcome deadline in milliseconds |
| `publishRetry` | `boolean \| AmqpPublishRetryOptions` | `false` | Opt-in bounded retry for **connection-class** publish failures (`AmqpConnectionError`; timeouts only via `retryOnTimeout`) — a broker blip becomes a transparent delay. At-least-once; `x-event-id`/`messageId` stay stable across attempts (consumer-side dedup anchor). Deterministic outcomes (nack, unroutable, `404`/`406` channel-close) never retry. The loop aborts on `disconnect()` and is covered by the bus-level `drainPublishTimeout`. Available since 1.3.0 |

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
| `maxDelay` | `number` | `30000` | Base delay cap in ms. Jitter is applied on top of the capped base, so the effective wait can exceed this (~20% at the default jitter, up to ~2x at `jitter: 1`) |
| `factor` | `number` | `2` | Exponential backoff factor |
| `jitter` | `number` | `0.2` | Symmetric jitter factor (0..1): the delay is drawn uniformly from `[base × (1 − jitter), base × (1 + jitter)]` |
| `maxRetries` | `number` | `Infinity` | Attempts per series before giving up. Governs **both** the initial connect and each later recovery series; the counter resets on every success. To bound only startup, use `initialConnectMaxRetries` |
| `initialConnectMaxRetries` | `number` | unset | Bound the **initial** connect independently (N retries = N+1 attempts): the adapter runs a bounded validate-connect loop with per-attempt lifecycle events (`reconnecting`, `setup-failed {initial: true}`) and rejects `connect()` with a typed `AmqpConnectionError` on exhaustion (after a terminal `reconnect-failed`) — instead of blocking forever. Backoff matches amqplib's formula exactly. Available since 1.3.0 |

### `AmqpLifecycleCallbacks`

The preferred surface is the single discriminated **`onLifecycle`** callback (since 1.3.0); the flat callbacks below are a compatibility shim over the same event stream, deprecated since 1.3.0 (removal not before 2.0). When both are set, flat callbacks fire after `onLifecycle` for the same underlying event.

Callbacks **must not throw** -- dispatch runs inside the connection driver's event handlers, so exceptions are isolated (swallowed) to protect the connection. Setting `onLifecycle` (like `onSetupFailed` / `failFastOnInitialSetupError`) enables the startup validation probe -- one extra short-lived connection plus a topology validation pass at `connect()` (requires recovery enabled).

```typescript
lifecycle: {
  onLifecycle: (event) => {
    if (event.type === 'disconnected') metrics.increment('amqp.disconnects');
    if (event.type === 'setup-failed' && event.initial) log.fatal(event.error);
    if (event.type === 'blocked') log.warn(`broker flow control: ${event.reason}`);
  },
},
```

| Event `type` | Payload | Fires when |
|--------------|---------|------------|
| `connected` | `reconnected: boolean` | Connection established -- exactly once per (re)connect; `false` for the initial connect, `true` after a recovery |
| `disconnected` | `error: Error` | Connection lost -- exactly once per drop |
| `reconnecting` | `attempt, delay, error` | A reconnect attempt is scheduled (exactly once per scheduled retry) |
| `reconnect-failed` | `error: Error` | Terminal: retry budget exhausted (`maxRetries`), or the cycle was stopped by the fatal topology policy (`treatTopologyErrorAsFatal`) |
| `setup-failed` | `initial, attempt, error` | Topology/setup failed on the initial validation probe (`initial: true`) or a reconnect re-assert (`initial: false`) |
| `blocked` | `reason: string` | Broker flow control (`connection.blocked`, e.g. a memory/disk alarm). Union-only -- no flat equivalent |
| `unblocked` | -- | Broker resumed after flow control. Union-only -- no flat equivalent |

Deprecated flat callbacks (compatibility shim): `onConnected()`, `onDisconnected(cause)`, `onReconnecting({ attempt, delay, error })`, `onReconnectFailed(cause)`, `onSetupFailed(error, { initial, attempt })` (since 1.2.0).

**Scope**: with amqplib's own initial loop (default), the retry loop of the **initial** connect (broker unreachable when `connect()` is called) runs before the lifecycle wiring can attach, so its per-retry events are not surfaced; the startup probe covers the deterministic-misconfiguration case. Set `recovery.initialConnectMaxRetries` (since 1.3.0) to make the adapter own that window — its bounded phase surfaces per-attempt `reconnecting`/`setup-failed` events and a terminal `reconnect-failed` on budget exhaustion.

::: tip Fixed in 1.3.0
A socket-level connection cut used to fire `onDisconnected` twice; it now fires exactly once per drop on both surfaces (disconnect-counter metrics roughly halve). In `recovery: false` mode a server-forced graceful close now surfaces a single `disconnected` (previously no event).
:::

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
    onLifecycle: (event) => console.log('AMQP lifecycle:', event.type, event),
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
- Publishing during a disconnected window (or while recovery is in progress) fails fast with `AmqpConnectionError` — unless the opt-in `publishRetry` is enabled (since 1.3.0), which retries connection-class failures in place with bounded backoff. In-flight publishes at the moment of a connection loss also reject with `AmqpConnectionError` (retried under the same opt-in). The auto-retry boundary is the exported `isAutoRetriablePublishError` and is deliberately narrower than the at-least-once republish policy: a broker nack and other deterministic outcomes never auto-retry.
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
| `AmqpTopologyError` | Topology declaration or verification failed (missing object in `check` mode, conflicting redeclare in `assert` mode); carries a machine-readable `.object` since 1.3.0 |
| `AmqpSerializationError` | Payload encoding failed in a custom `serialization.encode` hook |

Since 1.3.0, `AmqpTopologyError` also carries **`object`** (`AmqpTopologyObject`) identifying the failing topology object -- `{ kind: 'exchange' | 'queue', name }` or `{ kind: 'binding', source, destination, destinationType, routingKey }` (a binding has no name of its own). It is populated structurally at the declare/check/consume site, so CI drift checks and observability never parse broker-reply text. One documented exception: the config-validation error for a malformed binding declaration (neither `queue` nor `exchange` set) carries no `object`.

```typescript
try {
  await bus.start();
} catch (err) {
  if (err instanceof AmqpTopologyError && err.object?.kind === 'queue') {
    console.error(`Topology drift: queue '${err.object.name}' rejected by the broker`, err.cause);
  }
}
```

## Connection Recovery

Recovery is delegated to amqplib v2 native opt-in recovery and is **enabled by default**. Pass `recovery: false` to restore single-shot, no-reconnect behavior, or pass an `AmqpRecoveryOptions` object to tune the backoff.

On every successful (re)connect the adapter:

1. Re-creates its publish and consumer channels.
2. Re-applies topology (per `topologyMode`).
3. Replays all active subscriptions.

Connection behavior:

- **With recovery enabled**, `connect()` retries with backoff until the broker becomes reachable -- convenient for `docker-compose` startup ordering where the broker may not be up yet. Under the default `maxRetries: Infinity`, `connect()` blocks rather than failing fast; set `failFastOnInitialSetupError: true` to reject `connect()` with a typed `AmqpTopologyError` on a **permanent** setup/topology error at startup while still recovering from transient broker outages.
- **`maxRetries` scope.** The retry budget governs **both** the initial connect and every later recovery series, with the counter reset on each success. A finite value chosen only to bound startup therefore also caps steady-state recovery: a transient blip of that many consecutive failures in any single series permanently stops recovery.
- **Reconnect delay.** The effective delay is symmetric jitter around the exponential base -- uniform in `[base × (1 − jitter), base × (1 + jitter)]` with `base = min(maxDelay, initialDelay × factor^(attempt − 1))`. The cap applies to the base **before** jitter, so the wait can overshoot `maxDelay` (~20% at the default `jitter: 0.2`, up to ~2x at `jitter: 1`).
- **Topology drift during recovery.** Under the default policy, a queue/exchange deleted or incompatibly redeclared while the adapter reconnects makes every recovery attempt fail deterministically -- the cycle retries forever, reporting `setup-failed` per attempt (and heals if the topology is restored). Set `treatTopologyErrorAsFatal: true` to stop the cycle on the first such failure instead: the adapter reports `setup-failed` then the terminal `reconnect-failed`, tears down fully (consumers are dead; a later `connect()` starts from a clean slate), and subsequent publishes fail fast with `AmqpConnectionError`. The gate is the AMQP reply code of the cause (`404`/`406` = deterministic; transient causes -- including the cluster classic-queue "home node ... down or inaccessible" 404 -- stay in recovery). Boot-time drift is `failFastOnInitialSetupError`'s job; the broker-unreachable-at-boot window is closed by `recovery.initialConnectMaxRetries` (since 1.3.0).
- **With `recovery: false`**, `connect()` rejects immediately if the broker is unreachable, and a lost connection is not restored.

Observe connection state through `lifecycle.onLifecycle` (discriminated union; preferred since 1.3.0) or the deprecated flat callbacks (`onConnected`, `onDisconnected`, `onReconnecting`, `onReconnectFailed`, `onSetupFailed`).

### Tuning the reconnect backoff

The delay strategy is fixed inside amqplib -- a pluggable backoff hook and an independent initial-connect budget are proposed upstream ([amqp-node/amqplib#855](https://github.com/amqp-node/amqplib/issues/855), [amqp-node/amqplib#856](https://github.com/amqp-node/amqplib/issues/856); tracked in [connectum#199](https://github.com/Connectum-Framework/connectum/issues/199) and [connectum#198](https://github.com/Connectum-Framework/connectum/issues/198)).

One shape that **is** expressible exactly with the current knobs is AWS-style **full jitter** with a hard cap -- the delay drawn uniformly from `[0, min(cap, schedule step)]`, never above the cap. Set `jitter: 1` and halve both `initialDelay` and `maxDelay`:

```typescript
// Full jitter over an intended 500ms → 30s exponential schedule, hard-capped at 30s:
recovery: {
  jitter: 1,          // delay becomes uniform in [0, 2 × base]
  initialDelay: 250,  // half of the intended 500ms first step
  maxDelay: 15_000,   // half of the intended 30s cap
}
```

With `jitter: 1` the delay is uniform in `[0, 2 × base]`; halving the knobs makes `2 × base` trace the intended schedule, so the effective delay never exceeds the intended cap.

::: warning Caveat
This leans on the exact internal delay formula of amqplib v2 (verified against 2.0.1: `base = min(maxDelay, initialDelay × factor^(attempt − 1))`, then a uniform offset of `± base × jitter`). It is precise today but is not a documented amqplib contract -- re-verify after amqplib upgrades.
:::

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

## Testing

A programmable test double ships via the **`@connectum/events-amqp/testing`** subpath (since 1.3.0) -- model AMQP failure semantics in unit tests without a broker and without `amqplib` in the runtime graph:

```typescript
import { FakeAmqpAdapter } from '@connectum/events-amqp/testing';
import { AmqpPublishNackError, AmqpPublishTimeoutError } from '@connectum/events-amqp';

const fake = FakeAmqpAdapter({ lifecycle: { onLifecycle: (e) => log.push(e) } });
const bus = createEventBus({ adapter: fake, routes: [eventRoutes] });
await bus.start();

// Inject publish outcomes (FIFO; empty queue = ack). This includes
// AmqpPublishTimeoutError -- the state-UNKNOWN outcome that no real broker
// (or even Toxiproxy) reproduces deterministically:
fake.control.nextPublish(new AmqpPublishNackError('nacked'), new AmqpPublishTimeoutError('no outcome'));
await assert.rejects(() => bus.publish(OrderSchema, order), AmqpPublishNackError);
await assert.rejects(() => bus.publish(OrderSchema, order), AmqpPublishTimeoutError);

// Drive the connection lifecycle deterministically:
fake.control.dropConnection();     // disconnected → reconnecting (publishes fail fast; subscribes PARK)
fake.control.failSetup();          // the next recovery re-assert fails (setup-failed for topology errors)
fake.control.completeRecovery();   // …consume it, then heal on the next call
fake.control.completeRecovery();   // connected { reconnected: true }, parked subscribes complete

// Deliver events (wildcards + competing-consumer groups) and assert settlement:
const result = await fake.control.deliver('order.created', payload);
// result: { delivered, acked, nacked, requeued, failed }
```

**Parity contract.** Lifecycle events go through the real adapter's dispatch, so the canonical `AmqpLifecycleEvent` union ordering, the deprecated flat callbacks, and exception isolation match by construction. Errors are the real typed classes -- `instanceof` holds across the subpath boundary. The state machine mirrors the real adapter: `connect()` on a live, recovering, or retries-exhausted fake throws `already connected`; a mid-recovery `subscribe()` parks and settles with the recovery outcome; `setup-failed` and fail-fast gate on `AmqpTopologyError` exactly like the real probe. Incoming envelope headers (`x-event-id`, `x-published-at`) are honored and stripped like the real consumer.

**Documented divergences.** There is no timing simulation: recovery advances only via explicit `control` calls, and `reconnecting.delay` is `0`. Handler `ack`/`nack` calls are recorded in the `deliver()` result but do not drive redelivery -- re-deliver explicitly with `attempt + 1` (handler rejections are swallowed and counted as `failed`, like the real nack-on-error consumer). `control.published` records the bus-facing call, not the wire envelope. A queued topology `failSetup` at `connect()` without `failFastOnInitialSetupError` reports and proceeds instead of blocking forever.

::: tip Choosing a test double
For the generic happy path (routing, handlers, middleware, DLQ flows) prefer `MemoryAdapter` from `@connectum/events`. Reach for `FakeAmqpAdapter` when the test needs AMQP failure semantics: typed publish outcomes, recovery/lifecycle sequences, or topology-error classification. For real-broker semantics, run the integration suite against RabbitMQ.
:::

### `./testing` subpath exports

| Export | Description |
|--------|-------------|
| `FakeAmqpAdapter` | Factory creating the programmable fake (returns `FakeAmqpAdapterInstance`) |
| `FakeAmqpAdapterInstance` | The fake itself -- an `EventAdapter` extended with the `control` handle |
| `FakeAmqpAdapterOptions` | Options type (`lifecycle`, `failFastOnInitialSetupError`) |
| `FakeAmqpControl` | The control-surface type (`nextPublish`, `dropConnection`, `completeRecovery`, `exhaustRecovery`, `failSetup`, `block`/`unblock`, `deliver`, `published`) |
| `FakePublishOutcome` | One queued publish outcome: `"ack"` or an `Error` to reject with |
| `FakePublishedRecord` | One recorded bus-facing publish (`eventType`, `payload`, `options`) |
| `FakeDeliveryResult` | Settlement counts returned by `control.deliver()` |

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
| `AmqpTopologyError` | Topology declaration or verification failed; carries `.object` (since 1.3.0) |
| `AmqpTopologyObject` | Machine-readable identity of the failing topology object (exchange/queue by name; binding by endpoints) — since 1.3.0 |
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
| `AmqpLifecycleEvent` | Discriminated lifecycle event union delivered to `onLifecycle` — since 1.3.0 |

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
