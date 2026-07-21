[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [testing](../index.md) / FakeAmqpControl

# Interface: FakeAmqpControl

Defined in: [packages/events-amqp/src/testing.ts:88](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L88)

Deterministic control surface of the fake.

## Properties

### published

> `readonly` **published**: readonly [`FakePublishedRecord`](FakePublishedRecord.md)[]

Defined in: [packages/events-amqp/src/testing.ts:130](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L130)

Successfully acked publishes, in order.

## Methods

### block()

> **block**(`reason?`): `void`

Defined in: [packages/events-amqp/src/testing.ts:120](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L120)

Broker flow control: `blocked { reason }` / `unblocked` (union-only events).

#### Parameters

##### reason?

`string`

#### Returns

`void`

***

### completeRecovery()

> **completeRecovery**(): `void`

Defined in: [packages/events-amqp/src/testing.ts:111](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L111)

Advance a pending recovery: consumes a queued `failSetup` (reported per
its gating, stays recovering) or, with nothing queued, completes with
`connected { reconnected: true }` and settles parked subscribes.

#### Returns

`void`

***

### deliver()

> **deliver**(`eventType`, `payload`, `options?`): `Promise`\<[`FakeDeliveryResult`](FakeDeliveryResult.md)\>

Defined in: [packages/events-amqp/src/testing.ts:140](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L140)

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

Defined in: [packages/events-amqp/src/testing.ts:105](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L105)

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

Defined in: [packages/events-amqp/src/testing.ts:118](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L118)

Terminal outcome: `reconnect-failed { error }`. The dead adapter fails
publishes fast, rejects parked subscribes typed, and deactivates all
subscriptions (the cycle died — so did its consumers). Reconnect
requires `disconnect()` first, like the real retries-exhausted state.

#### Parameters

##### error?

`Error`

#### Returns

`void`

***

### failSetup()

> **failSetup**(`error?`, `object?`): `void`

Defined in: [packages/events-amqp/src/testing.ts:98](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L98)

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

### nextPublish()

> **nextPublish**(...`outcomes`): `void`

Defined in: [packages/events-amqp/src/testing.ts:128](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L128)

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

### unblock()

> **unblock**(): `void`

Defined in: [packages/events-amqp/src/testing.ts:121](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L121)

#### Returns

`void`
