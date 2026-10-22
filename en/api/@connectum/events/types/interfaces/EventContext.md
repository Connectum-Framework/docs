[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventContext

# Interface: EventContext

Defined in: [packages/events/src/types.ts:169](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L169)

Per-event context with explicit ack/nack control.

Passed to event handlers alongside the deserialized message.
Supports explicit ack/nack control. If the handler completes
without calling either, the event is automatically acknowledged.

## Properties

### attempt

> `readonly` **attempt**: `number`

Defined in: [packages/events/src/types.ts:179](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L179)

Delivery attempt number (1-based)

***

### eventId

> `readonly` **eventId**: `string`

Defined in: [packages/events/src/types.ts:173](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L173)

Unique event identifier

***

### eventType

> `readonly` **eventType**: `string`

Defined in: [packages/events/src/types.ts:175](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L175)

Event type / topic name

***

### metadata

> `readonly` **metadata**: `ReadonlyMap`\<`string`, `string`\>

Defined in: [packages/events/src/types.ts:181](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L181)

Event metadata (headers)

***

### publishedAt

> `readonly` **publishedAt**: `Date`

Defined in: [packages/events/src/types.ts:177](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L177)

When the event was published

***

### signal

> `readonly` **signal**: `AbortSignal`

Defined in: [packages/events/src/types.ts:171](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L171)

Abort signal (aborted when server is shutting down)

## Methods

### ack()

> **ack**(): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:183](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L183)

Acknowledge successful processing

#### Returns

`Promise`\<`void`\>

***

### nack()

> **nack**(`requeue?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:185](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L185)

Negative acknowledge -- request redelivery or send to DLQ

#### Parameters

##### requeue?

`boolean`

#### Returns

`Promise`\<`void`\>

***

### publish()

> **publish**\<`Desc`\>(`schema`, `data`, `options?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:200](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L200)

Publish an event on behalf of this delivery: the way a relay handler (consume, transform,
publish) hands its result on.

While the bus is stopping, `bus.publish` is refused, but this call is still admitted as long
as the handler of this delivery has not returned and the drain has not been aborted, and
`stop()` waits for it before the adapter is disconnected. The right belongs to this one
delivery, this bus and this start/stop cycle: it ends when the handler's promise settles,
when the drain is aborted, and when the bus stops; a call after that is rejected. Await the
result inside the handler, so a failed publish fails the handler and the message is retried.

Handlers that publish through an injected bus instead of `ctx` keep being refused during
`stop()`; rewrite them to use `ctx.publish` to relay during shutdown.

#### Type Parameters

##### Desc

`Desc` *extends* [`DescMessage`](https://protobufes.com/reference/reflection/descriptors/#types)

#### Parameters

##### schema

`Desc`

##### data

`MessageShape`\<`Desc`\>

##### options?

[`PublishOptions`](PublishOptions.md)

#### Returns

`Promise`\<`void`\>
