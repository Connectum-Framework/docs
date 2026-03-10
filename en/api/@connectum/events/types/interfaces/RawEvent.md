[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / RawEvent

# Interface: RawEvent

Defined in: [packages/events/src/types.ts:16](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L16)

Raw event data delivered by the adapter

## Properties

### attempt

> `readonly` **attempt**: `number`

Defined in: [packages/events/src/types.ts:26](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L26)

Delivery attempt number (1-based)

***

### eventId

> `readonly` **eventId**: `string`

Defined in: [packages/events/src/types.ts:18](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L18)

Unique event identifier

***

### eventType

> `readonly` **eventType**: `string`

Defined in: [packages/events/src/types.ts:20](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L20)

Event type / topic name

***

### metadata

> `readonly` **metadata**: `ReadonlyMap`\<`string`, `string`\>

Defined in: [packages/events/src/types.ts:28](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L28)

Event metadata (headers)

***

### payload

> `readonly` **payload**: `Uint8Array`

Defined in: [packages/events/src/types.ts:22](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L22)

Serialized protobuf payload

***

### publishedAt

> `readonly` **publishedAt**: `Date`

Defined in: [packages/events/src/types.ts:24](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L24)

When the event was published
