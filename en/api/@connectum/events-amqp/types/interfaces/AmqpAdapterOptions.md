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

Defined in: [packages/events-amqp/src/types.ts:149](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L149)

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
Enabling this (or supplying [AmqpLifecycleCallbacks.onSetupFailed](AmqpLifecycleCallbacks.md#onsetupfailed))
adds one extra short-lived connection at startup for the validation probe.

#### Default

```ts
false
```

***

### lifecycle?

> `readonly` `optional` **lifecycle?**: [`AmqpLifecycleCallbacks`](AmqpLifecycleCallbacks.md)

Defined in: [packages/events-amqp/src/types.ts:155](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L155)

Connection lifecycle callbacks. Connection errors are surfaced here —
not just logged.

***

### publisherOptions?

> `readonly` `optional` **publisherOptions?**: [`AmqpPublisherOptions`](AmqpPublisherOptions.md)

Defined in: [packages/events-amqp/src/types.ts:55](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L55)

Publisher options.

***

### publishTimeoutMs?

> `readonly` `optional` **publishTimeoutMs?**: `number`

Defined in: [packages/events-amqp/src/types.ts:165](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L165)

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

### url

> `readonly` **url**: `string`

Defined in: [packages/events-amqp/src/types.ts:16](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L16)

AMQP connection URL.

#### Example

```ts
"amqp://guest:guest@localhost:5672"
```
