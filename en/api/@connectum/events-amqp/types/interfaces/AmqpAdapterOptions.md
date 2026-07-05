[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpAdapterOptions

# Interface: AmqpAdapterOptions

Defined in: [packages/events-amqp/src/types.ts:10](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L10)

Options for creating an AMQP/RabbitMQ adapter.

## Properties

### consumerOptions?

> `readonly` `optional` **consumerOptions?**: [`AmqpConsumerOptions`](AmqpConsumerOptions.md)

Defined in: [packages/events-amqp/src/types.ts:50](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L50)

Consumer options.

***

### exchange?

> `readonly` `optional` **exchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:28](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L28)

Exchange name for publishing and subscribing.

#### Default

```ts
"connectum.events"
```

***

### exchangeOptions?

> `readonly` `optional` **exchangeOptions?**: [`AmqpExchangeOptions`](AmqpExchangeOptions.md)

Defined in: [packages/events-amqp/src/types.ts:40](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L40)

Exchange assertion options.

***

### exchangeType?

> `readonly` `optional` **exchangeType?**: `"headers"` \| `"topic"` \| `"direct"` \| `"fanout"`

Defined in: [packages/events-amqp/src/types.ts:35](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L35)

Exchange type.

#### Default

```ts
"topic"
```

***

### failFastOnInitialSetupError?

> `readonly` `optional` **failFastOnInitialSetupError?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:152](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L152)

Fail fast on a DETERMINISTIC setup/topology error on the FIRST connect,
instead of entering amqplib's infinite recovery loop.

amqplib's opt-in recovery resolves `connect()` only after its setup hook
succeeds, and rejects only once `maxRetries` is exhausted (default
`Infinity`). A permanent topology error on the first connect under the
default recovery therefore HANGS `connect()` forever, with no thrown error
and — because the lifecycle listeners attach only after that never-returning
await — no callback. When this flag is `true` (and recovery is enabled), the
adapter first validates topology against a throwaway non-recovering
connection; a topology error rejects `connect()` with the typed
`AmqpTopologyError` / `AmqpConnectionError`.

Only deterministic setup/topology errors fail fast. A transient
broker-unreachable at startup is NOT a fail-fast condition — it falls
through to normal recovery (block-until-broker). SUBSEQUENT reconnects
always keep infinite-recovery behavior.

No-op with `recovery: false` (that path already fails fast on setup).
Enabling this — or supplying [AmqpLifecycleCallbacks.onLifecycle](AmqpLifecycleCallbacks.md#onlifecycle)
or [AmqpLifecycleCallbacks.onSetupFailed](AmqpLifecycleCallbacks.md#onsetupfailed) — adds one extra
short-lived connection plus a topology validation pass at startup for
the probe (recovery must be enabled; with `recovery: false` no probe
runs and no `setup-failed` event is delivered).

#### Default

```ts
false
```

***

### lifecycle?

> `readonly` `optional` **lifecycle?**: [`AmqpLifecycleCallbacks`](AmqpLifecycleCallbacks.md)

Defined in: [packages/events-amqp/src/types.ts:249](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L249)

Connection lifecycle callbacks. Connection errors are surfaced here —
not just logged.

***

### publisherOptions?

> `readonly` `optional` **publisherOptions?**: [`AmqpPublisherOptions`](AmqpPublisherOptions.md)

Defined in: [packages/events-amqp/src/types.ts:55](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L55)

Publisher options.

***

### publishRetry?

> `readonly` `optional` **publishRetry?**: `boolean` \| [`AmqpPublishRetryOptions`](AmqpPublishRetryOptions.md)

Defined in: [packages/events-amqp/src/types.ts:243](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L243)

Opt-in bounded publish retry for CONNECTION-CLASS outcomes (since 1.3.0).

When enabled, a `publish()` that fails with `AmqpConnectionError` —
publishing during a recovery window, or an in-flight confirm lost to a
connection drop — is retried in place (the caller's promise stays
pending) instead of rejecting immediately: a short broker blip becomes
a transparent delay. `true` = defaults; an object tunes the budget.

The retry boundary is [isAutoRetriablePublishError](../../functions/isAutoRetriablePublishError.md) — deliberately
NARROWER than the at-least-once republish matrix in the error taxonomy:
a broker `nack` is republish-safe by policy but is NOT auto-retried
inline (it is an explicit broker refusal, e.g. an over-capacity queue —
hammering it in a tight loop helps nobody). `AmqpPublishTimeoutError`
joins the boundary only with `retryOnTimeout: true`.

Semantics — read before enabling:
- **At-least-once, full stop.** A retried publish whose previous attempt
  was lost IN FLIGHT (confirm never arrived: state UNKNOWN) may
  duplicate on the broker. `x-event-id` / `messageId` stay STABLE across
  attempts (also with `externalContract` — a caller-supplied id is
  reused as-is), so consumer-side dedup keys on them.
- **Worst-case latency**: each attempt is bounded by `publishTimeoutMs`
  (default 30s), so `maxRetries: 5` can hold a single `publish()` for
  several minutes worst-case — far beyond typical 30s RPC timeouts.
  There is deliberately no second overall-deadline knob: bound the
  budget via `maxRetries`/`publishTimeoutMs`.
- **Shutdown-aware**: the loop aborts on `disconnect()` (throws the last
  connection error) and, living inside the `adapter.publish()` promise,
  is automatically covered by the bus-level `drainPublishTimeout`.
- **Single-flight** (`mandatory: true` with `correlationHeader: false`;
  `externalContract` forces the latter but single-flight still requires
  `mandatory`): retries hold the chain — ordering is preserved at the
  cost of head-of-line blocking during backoff. In this headerless mode
  a late `basic.return` from an abandoned timed-out attempt may mark the
  current one (correlation is attempt-agnostic without the header) —
  prefer the default header correlation when combining `mandatory` with
  `retryOnTimeout`.
- **Deterministic channel-close is not retried**: a broker reply with a
  `404`/`406` code that killed the publish CHANNEL (e.g. a publish to a
  missing exchange under `topologyMode: "skip"`) surfaces immediately
  with the broker reply as `cause` — the connection stays up, recovery
  never recreates the channel, so retrying cannot heal.

Backoff mirrors the recovery formula (same knob names and semantics,
incl. cap-before-jitter), but the DEFAULT budget differs: `maxRetries`
here defaults to **5** (bounded), not `Infinity`.

#### Default

```ts
undefined (disabled — behavior unchanged)
```

***

### publishTimeoutMs?

> `readonly` `optional` **publishTimeoutMs?**: `number`

Defined in: [packages/events-amqp/src/types.ts:259](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L259)

Per-publish broker-outcome deadline in milliseconds. A publish whose
ack/nack/return/connection-loss outcome does not arrive in time
rejects with `AmqpPublishTimeoutError` (message state UNKNOWN — an
at-least-once producer should republish).

#### Default

```ts
30000
```

***

### queueOptions?

> `readonly` `optional` **queueOptions?**: [`AmqpQueueOptions`](AmqpQueueOptions.md)

Defined in: [packages/events-amqp/src/types.ts:45](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L45)

Default queue assertion options.

***

### queueOverrides?

> `readonly` `optional` **queueOverrides?**: `Record`\<`string`, [`AmqpQueueOverride`](AmqpQueueOverride.md)\>

Defined in: [packages/events-amqp/src/types.ts:101](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L101)

Map a consumer group name to an externally-named queue.

By default a group consumes from `${exchange}.${group}`. An override
lets a subscription attach to a queue from an external contract
(with its own arguments) instead.

***

### recovery?

> `readonly` `optional` **recovery?**: `boolean` \| [`AmqpRecoveryOptions`](AmqpRecoveryOptions.md)

Defined in: [packages/events-amqp/src/types.ts:122](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L122)

Automatic connection recovery (delegated to amqplib's opt-in
recovery). Enabled by default; pass `false` to restore
no-reconnect behavior.

On every (re)connect the adapter re-creates its channels, re-applies
topology (per `topologyMode`), and replays active subscriptions.
In-flight publishes at the moment of a connection loss reject with
`AmqpConnectionError`.

`maxRetries` governs BOTH the initial connect and steady-state recovery
(counter reset on success); under the default `Infinity`, `connect()`
blocks until the broker is reachable rather than failing fast (see
[AmqpAdapterOptions.failFastOnInitialSetupError](#failfastoninitialsetuperror) to fail fast on a
deterministic startup misconfiguration). See [AmqpRecoveryOptions](AmqpRecoveryOptions.md)
for the retry-budget scope and jitter/`maxDelay` overshoot.

#### Default

```ts
true (amqplib defaults: 100ms initial, ×2, 30s cap, jitter 0.2, infinite retries)
```

***

### serialization?

> `readonly` `optional` **serialization?**: [`AmqpSerializationOptions`](AmqpSerializationOptions.md)

Defined in: [packages/events-amqp/src/types.ts:66](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L66)

Message serialization metadata and optional wire transcoding.

The adapter receives payloads as bytes (the EventBus serializes
protobuf upstream); this option controls the AMQP `contentType`
property and lets an application transcode the wire body — e.g. when
the application serializes JSON itself and publishes through the
adapter directly against an external AsyncAPI contract.

***

### socketOptions?

> `readonly` `optional` **socketOptions?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:21](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L21)

Socket options passed to `amqplib.connect()`.

***

### topology?

> `readonly` `optional` **topology?**: [`AmqpTopology`](AmqpTopology.md)

Defined in: [packages/events-amqp/src/types.ts:74](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L74)

Explicit topology to declare on connect (and re-declare after
recovery): exchanges, queues with arbitrary external names and raw
arguments (e.g. `x-dead-letter-exchange`), and bindings — including
exchange-to-exchange.

***

### topologyMode?

> `readonly` `optional` **topologyMode?**: [`AmqpTopologyMode`](../type-aliases/AmqpTopologyMode.md)

Defined in: [packages/events-amqp/src/types.ts:92](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L92)

How topology is established:
- `"assert"` (default) — declare idempotently (assertExchange/assertQueue/bind);
- `"check"` — existence-only verification (checkExchange/checkQueue). A
  missing object raises AmqpTopologyError, which fails `connect()` fast
  ONLY with `recovery: false` or `failFastOnInitialSetupError: true`; under
  the default recovery a first-connect check failure otherwise enters the
  (infinite) recovery loop and is surfaced via `onSetupFailed` /
  `onReconnecting` rather than rejecting `connect()`. AMQP offers no passive
  introspection: argument equivalence and binding presence are NOT
  verifiable in this mode (a conflicting redeclare elsewhere is
  PRECONDITION_FAILED 406);
- `"skip"` — no topology operations at all; the application owns topology.

#### Default

```ts
"assert"
```

***

### treatTopologyErrorAsFatal?

> `readonly` `optional` **treatTopologyErrorAsFatal?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:191](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L191)

Treat DETERMINISTIC topology drift during steady-state recovery as
fatal: stop the reconnect cycle instead of retrying forever against a
misconfigured broker.

Under the default `maxRetries: Infinity`, a queue/exchange deleted or
redeclared incompatibly while the adapter is reconnecting makes every
recovery attempt fail deterministically — the adapter would retry
forever, reporting `setup-failed` on each attempt but never giving up.
With this flag the adapter stops the cycle on the first such failure
and reports the terminal `reconnect-failed` lifecycle event (after the
`setup-failed` event for the same attempt); subsequent publishes fail
fast with `AmqpConnectionError`.

The gate is the AMQP reply code of the failure cause — `404`
(NOT_FOUND) or `406` (PRECONDITION_FAILED) — NOT the error class:
transient causes wrapped into `AmqpTopologyError` during a setup pass
(broker restarting `320`, internal error `541`, resource locked `405`,
a mid-setup connection drop) stay in normal recovery. One known
transient 404 is excluded explicitly: a RabbitMQ cluster classic queue
whose home node is down ("... down or inaccessible") stays in recovery.

After the fatal stop the adapter is fully torn down: consumers are dead
(subscription records are cleared, mirroring `disconnect()`), publishes
fail fast, and a later `connect()` starts from a clean slate —
re-subscribe explicitly.

Scope: steady-state recovery only. Boot-time drift is the startup
probe's job — see [failFastOnInitialSetupError](#failfastoninitialsetuperror). Setting both
covers boot and steady state; the remaining window — broker unreachable
at `connect()` time with drift surfacing before the first successful
connect — is closed by
[AmqpRecoveryOptions.initialConnectMaxRetries](AmqpRecoveryOptions.md#initialconnectmaxretries) (since 1.3.0),
whose bounded phase surfaces those failures and rejects on exhaustion.

#### Default

```ts
false
```

***

### url

> `readonly` **url**: `string`

Defined in: [packages/events-amqp/src/types.ts:16](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L16)

AMQP connection URL.

#### Example

```ts
"amqp://guest:guest@localhost:5672"
```
