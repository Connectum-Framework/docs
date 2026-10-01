[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [testing](../index.md) / FakeAmqpControl

# Interface: FakeAmqpControl

Defined in: [packages/events-amqp/src/testing.ts:89](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L89)

Deterministic control surface of the fake.

## Properties

### published

> `readonly` **published**: readonly [`FakePublishedRecord`](FakePublishedRecord.md)[]

Defined in: [packages/events-amqp/src/testing.ts:133](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L133)

Successfully acked publishes, in order.

## Methods

### block()

> **block**(`reason?`): `void`

Defined in: [packages/events-amqp/src/testing.ts:123](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L123)

Broker flow control: `blocked { reason }` / `unblocked` (union-only events).

#### Parameters

##### reason?

`string`

#### Returns

`void`

***

### completeRecovery()

> **completeRecovery**(): `void`

Defined in: [packages/events-amqp/src/testing.ts:112](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L112)

Advance a pending recovery: consumes a queued `failSetup` (reported per
its gating, stays recovering) or, with nothing queued, completes with
`connected { reconnected: true }` and settles parked subscribes.

#### Returns

`void`

***

### deliver()

> **deliver**(`eventType`, `payload`, `options?`): `Promise`\<[`FakeDeliveryResult`](FakeDeliveryResult.md)\>

Defined in: [packages/events-amqp/src/testing.ts:143](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L143)

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

Defined in: [packages/events-amqp/src/testing.ts:106](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L106)

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

Defined in: [packages/events-amqp/src/testing.ts:121](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L121)

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

Defined in: [packages/events-amqp/src/testing.ts:99](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L99)

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

Defined in: [packages/events-amqp/src/testing.ts:131](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L131)

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

Defined in: [packages/events-amqp/src/testing.ts:124](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L124)

#### Returns

`void`
