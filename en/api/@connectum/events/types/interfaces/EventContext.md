[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventContext

# Interface: EventContext

Defined in: [packages/events/src/types.ts:133](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L133)

Per-event context with explicit ack/nack control.

Passed to event handlers alongside the deserialized message.
Supports explicit ack/nack control. If the handler completes
without calling either, the event is automatically acknowledged.

## Properties

### attempt

> `readonly` **attempt**: `number`

Defined in: [packages/events/src/types.ts:143](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L143)

Delivery attempt number (1-based)

***

### eventId

> `readonly` **eventId**: `string`

Defined in: [packages/events/src/types.ts:137](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L137)

Unique event identifier

***

### eventType

> `readonly` **eventType**: `string`

Defined in: [packages/events/src/types.ts:139](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L139)

Event type / topic name

***

### metadata

> `readonly` **metadata**: `ReadonlyMap`\<`string`, `string`\>

Defined in: [packages/events/src/types.ts:145](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L145)

Event metadata (headers)

***

### publishedAt

> `readonly` **publishedAt**: `Date`

Defined in: [packages/events/src/types.ts:141](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L141)

When the event was published

***

### signal

> `readonly` **signal**: `AbortSignal`

Defined in: [packages/events/src/types.ts:135](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L135)

Abort signal (aborted when server is shutting down)

## Methods

### ack()

> **ack**(): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:147](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L147)

Acknowledge successful processing

#### Returns

`Promise`\<`void`\>

***

### nack()

> **nack**(`requeue?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:149](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L149)

Negative acknowledge -- request redelivery or send to DLQ

#### Parameters

##### requeue?

`boolean`

#### Returns

`Promise`\<`void`\>
