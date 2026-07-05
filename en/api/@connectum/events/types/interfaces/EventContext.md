[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventContext

# Interface: EventContext

Defined in: [packages/events/src/types.ts:161](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L161)

Per-event context with explicit ack/nack control.

Passed to event handlers alongside the deserialized message.
Supports explicit ack/nack control. If the handler completes
without calling either, the event is automatically acknowledged.

## Properties

### attempt

> `readonly` **attempt**: `number`

Defined in: [packages/events/src/types.ts:171](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L171)

Delivery attempt number (1-based)

***

### eventId

> `readonly` **eventId**: `string`

Defined in: [packages/events/src/types.ts:165](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L165)

Unique event identifier

***

### eventType

> `readonly` **eventType**: `string`

Defined in: [packages/events/src/types.ts:167](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L167)

Event type / topic name

***

### metadata

> `readonly` **metadata**: `ReadonlyMap`\<`string`, `string`\>

Defined in: [packages/events/src/types.ts:173](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L173)

Event metadata (headers)

***

### publishedAt

> `readonly` **publishedAt**: `Date`

Defined in: [packages/events/src/types.ts:169](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L169)

When the event was published

***

### signal

> `readonly` **signal**: `AbortSignal`

Defined in: [packages/events/src/types.ts:163](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L163)

Abort signal (aborted when server is shutting down)

## Methods

### ack()

> **ack**(): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:175](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L175)

Acknowledge successful processing

#### Returns

`Promise`\<`void`\>

***

### nack()

> **nack**(`requeue?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:177](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L177)

Negative acknowledge -- request redelivery or send to DLQ

#### Parameters

##### requeue?

`boolean`

#### Returns

`Promise`\<`void`\>
