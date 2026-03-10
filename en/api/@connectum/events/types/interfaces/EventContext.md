[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventContext

# Interface: EventContext

Defined in: [packages/events/src/types.ts:106](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L106)

Per-event context with explicit ack/nack control.

Passed to event handlers alongside the deserialized message.
Supports explicit ack/nack control. If the handler completes
without calling either, the event is automatically acknowledged.

## Properties

### attempt

> `readonly` **attempt**: `number`

Defined in: [packages/events/src/types.ts:116](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L116)

Delivery attempt number (1-based)

***

### eventId

> `readonly` **eventId**: `string`

Defined in: [packages/events/src/types.ts:110](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L110)

Unique event identifier

***

### eventType

> `readonly` **eventType**: `string`

Defined in: [packages/events/src/types.ts:112](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L112)

Event type / topic name

***

### metadata

> `readonly` **metadata**: `ReadonlyMap`\<`string`, `string`\>

Defined in: [packages/events/src/types.ts:118](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L118)

Event metadata (headers)

***

### publishedAt

> `readonly` **publishedAt**: `Date`

Defined in: [packages/events/src/types.ts:114](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L114)

When the event was published

***

### signal

> `readonly` **signal**: `AbortSignal`

Defined in: [packages/events/src/types.ts:108](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L108)

Abort signal (aborted when server is shutting down)

## Methods

### ack()

> **ack**(): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:120](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L120)

Acknowledge successful processing

#### Returns

`Promise`\<`void`\>

***

### nack()

> **nack**(`requeue?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:122](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L122)

Negative acknowledge -- request redelivery or send to DLQ

#### Parameters

##### requeue?

`boolean`

#### Returns

`Promise`\<`void`\>
