[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [testing](../index.md) / FakeAmqpControl

# Interface: FakeAmqpControl

Defined in: [packages/events-amqp/src/testing.ts:110](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L110)

Deterministic control surface of the fake.

## Properties

### published

> `readonly` **published**: readonly [`FakePublishedRecord`](FakePublishedRecord.md)[]

Defined in: [packages/events-amqp/src/testing.ts:183](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L183)

Successfully acked publishes, in order.

## Methods

### block()

> **block**(`reason?`): `void`

Defined in: [packages/events-amqp/src/testing.ts:173](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L173)

Broker flow control: `blocked { reason }` / `unblocked` (union-only events).

#### Parameters

##### reason?

`string`

#### Returns

`void`

***

### completeRecovery()

> **completeRecovery**(): `void`

Defined in: [packages/events-amqp/src/testing.ts:133](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L133)

Advance a pending recovery: consumes a queued `failSetup` (reported per
its gating, stays recovering) or, with nothing queued, completes with
`connected { reconnected: true }` and settles parked subscribes.

#### Returns

`void`

***

### deliver()

> **deliver**(`eventType`, `payload`, `options?`): `Promise`\<[`FakeDeliveryResult`](FakeDeliveryResult.md)\>

Defined in: [packages/events-amqp/src/testing.ts:193](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L193)

Deliver an event to matching subscriptions (NATS-style wildcard
matching, one consumer per distinct group — competing-consumer parity;
requires the connected state, like a real broker). Internal envelope
keys (`x-event-id`, `x-published-at`, `x-connectum-publish-id`) are
honored and stripped from handler-visible metadata, mirroring the real
consumer. Resolves with the settlement summary once every handler
settles; handler rejections are swallowed (counted in `failed`).

#### Parameters

##### eventType

`string`

##### payload

`Uint8Array`

##### options?

###### attempt?

`number`

###### metadata?

`Record`\<`string`, `string`\>

#### Returns

`Promise`\<[`FakeDeliveryResult`](FakeDeliveryResult.md)\>

***

### dropConnection()

> **dropConnection**(`error?`): `void`

Defined in: [packages/events-amqp/src/testing.ts:127](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L127)

Sever the connection: dispatches `disconnected { error }` then
`reconnecting { attempt: 1, delay: 0 }` and parks in the recovering
state — publishes fail fast with `AmqpConnectionError`, exactly like
the real adapter's recovery window; new `subscribe()` calls PARK.

#### Parameters

##### error?

`Error`

#### Returns

`void`

***

### exhaustRecovery()

> **exhaustRecovery**(`error?`): `void`

Defined in: [packages/events-amqp/src/testing.ts:142](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L142)

Terminal outcome: `reconnect-failed { error }`. Like the real adapter,
the dead cycle is forgotten BEFORE the event is dispatched: publishes and
new subscribes fail fast with the real adapter's typed "not connected"
error, all subscriptions are dropped (the cycle died — so did its
consumers), and a later `connect()` starts clean without them. Parked
subscribes reject with a typed `AmqpConnectionError`.

#### Parameters

##### error?

`Error`

#### Returns

`void`

***

### failSetup()

> **failSetup**(`error?`, `object?`): `void`

Defined in: [packages/events-amqp/src/testing.ts:120](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L120)

Queue a setup failure. An `AmqpTopologyError` (the default) follows the
real gating: `setup-failed { initial: true, attempt: 0 }` at `connect()`
(typed rejection under `failFastOnInitialSetupError`), or
`setup-failed { initial: false, attempt }` at the next
[completeRecovery](#completerecovery). A NON-topology error follows the real gating
too: no `setup-failed` event — at `connect()` it is consumed silently,
at `completeRecovery` it only schedules the next `reconnecting`.

#### Parameters

##### error?

`Error`

##### object?

[`AmqpTopologyObject`](../../type-aliases/AmqpTopologyObject.md)

#### Returns

`void`

***

### loseConsumer()

> **loseConsumer**(`options?`): `void`

Defined in: [packages/events-amqp/src/testing.ts:161](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L161)

The broker ends consumers while the connection stays up (the queue was
deleted, the consumer was cancelled, the consumer channel was closed by a
channel exception). Every matching live subscription stops receiving
[deliver](#deliver)ies and gets one `consumer-lost { queue, cause, error?,
willRestore }` (`willRestore` mirrors the `recovery` option). Union-only
event, no flat-callback equivalent.

The fake has no exchange, so a subscription's queue is its `group`, or
`fake.sub-N` (N = 1-based order of registration) when it has none.
Without `queue`, every live subscription is lost; with it, every live
subscription on that queue is, even for `channel-closed` (see the
divergence list above).

Throws when the adapter is not `connected` (a connection loss is driven
by [dropConnection](#dropconnection)) or when nothing matches, so a test cannot
silently exercise nothing.

#### Parameters

##### options?

###### cause?

[`AmqpConsumerLossCause`](../../types/type-aliases/AmqpConsumerLossCause.md)

###### error?

`Error`

###### queue?

`string`

#### Returns

`void`

***

### nextPublish()

> **nextPublish**(...`outcomes`): `void`

Defined in: [packages/events-amqp/src/testing.ts:181](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L181)

Queue FIFO outcomes for upcoming `publish()` calls. An empty queue means
`"ack"`. Use the real error classes (`AmqpPublishNackError`,
`AmqpConnectionError`, `AmqpPublishTimeoutError` — the state-UNKNOWN
outcome only this fake reproduces deterministically, …).

#### Parameters

##### outcomes

...[`FakePublishOutcome`](../type-aliases/FakePublishOutcome.md)[]

#### Returns

`void`

***

### restoreConsumers()

> **restoreConsumers**(): `void`

Defined in: [packages/events-amqp/src/testing.ts:171](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L171)

Bring every lost subscription back: it receives [deliver](#deliver)ies again
and `consumer-restored { queue, attempt: 1 }` is delivered once per
subscription. Throws when the adapter is not `connected`, when
`recovery: false` (the real adapter would not restore), or when nothing
is lost. A [completeRecovery](#completerecovery) also brings lost subscriptions back,
silently: connection recovery re-creates every consumer, as in the real
adapter.

#### Returns

`void`

***

### unblock()

> **unblock**(): `void`

Defined in: [packages/events-amqp/src/testing.ts:174](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L174)

#### Returns

`void`
