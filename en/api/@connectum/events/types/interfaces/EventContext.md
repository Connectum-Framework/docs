[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventContext

# Interface: EventContext

Defined in: [types.ts:105](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L105)

Per-event context with explicit ack/nack control.

Passed to event handlers alongside the deserialized message.
No implicit acknowledgment -- handler must call ack() or nack().

## Properties

### attempt

> `readonly` **attempt**: `number`

Defined in: [types.ts:115](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L115)

Delivery attempt number (1-based)

***

### eventId

> `readonly` **eventId**: `string`

Defined in: [types.ts:109](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L109)

Unique event identifier

***

### eventType

> `readonly` **eventType**: `string`

Defined in: [types.ts:111](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L111)

Event type / topic name

***

### metadata

> `readonly` **metadata**: `ReadonlyMap`\<`string`, `string`\>

Defined in: [types.ts:117](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L117)

Event metadata (headers)

***

### publishedAt

> `readonly` **publishedAt**: `Date`

Defined in: [types.ts:113](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L113)

When the event was published

***

### signal

> `readonly` **signal**: `AbortSignal`

Defined in: [types.ts:107](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L107)

Abort signal (aborted when server is shutting down)

## Methods

### ack()

> **ack**(): `Promise`\<`void`\>

Defined in: [types.ts:119](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L119)

Acknowledge successful processing

#### Returns

`Promise`\<`void`\>

***

### nack()

> **nack**(`requeue?`): `Promise`\<`void`\>

Defined in: [types.ts:121](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L121)

Negative acknowledge -- request redelivery or send to DLQ

#### Parameters

##### requeue?

`boolean`

#### Returns

`Promise`\<`void`\>
