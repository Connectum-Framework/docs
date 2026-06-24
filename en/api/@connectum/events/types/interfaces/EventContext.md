[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventContext

# Interface: EventContext

Defined in: [packages/events/src/types.ts:146](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L146)

Per-event context with explicit ack/nack control.

Passed to event handlers alongside the deserialized message.
Supports explicit ack/nack control. If the handler completes
without calling either, the event is automatically acknowledged.

## Properties

### attempt

> `readonly` **attempt**: `number`

Defined in: [packages/events/src/types.ts:156](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L156)

Delivery attempt number (1-based)

***

### eventId

> `readonly` **eventId**: `string`

Defined in: [packages/events/src/types.ts:150](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L150)

Unique event identifier

***

### eventType

> `readonly` **eventType**: `string`

Defined in: [packages/events/src/types.ts:152](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L152)

Event type / topic name

***

### metadata

> `readonly` **metadata**: `ReadonlyMap`\<`string`, `string`\>

Defined in: [packages/events/src/types.ts:158](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L158)

Event metadata (headers)

***

### publishedAt

> `readonly` **publishedAt**: `Date`

Defined in: [packages/events/src/types.ts:154](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L154)

When the event was published

***

### signal

> `readonly` **signal**: `AbortSignal`

Defined in: [packages/events/src/types.ts:148](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L148)

Abort signal (aborted when server is shutting down)

## Methods

### ack()

> **ack**(): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:160](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L160)

Acknowledge successful processing

#### Returns

`Promise`\<`void`\>

***

### nack()

> **nack**(`requeue?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:162](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L162)

Negative acknowledge -- request redelivery or send to DLQ

#### Parameters

##### requeue?

`boolean`

#### Returns

`Promise`\<`void`\>
