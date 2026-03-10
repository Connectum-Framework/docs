[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventAdapter

# Interface: EventAdapter

Defined in: [packages/events/src/types.ts:78](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L78)

Minimal adapter interface for message brokers.

Inspired by Watermill (Go): minimal surface, broker-specific
config in constructor, not in interface methods.

## Properties

### name

> `readonly` **name**: `string`

Defined in: [packages/events/src/types.ts:80](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L80)

Adapter name for identification (e.g., "nats", "kafka", "redis", "memory")

## Methods

### connect()

> **connect**(): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:83](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L83)

Connect to the message broker

#### Returns

`Promise`\<`void`\>

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:86](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L86)

Disconnect from the message broker

#### Returns

`Promise`\<`void`\>

***

### publish()

> **publish**(`eventType`, `payload`, `options?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:89](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L89)

Publish a serialized event to a topic

#### Parameters

##### eventType

`string`

##### payload

`Uint8Array`

##### options?

[`PublishOptions`](PublishOptions.md)

#### Returns

`Promise`\<`void`\>

***

### subscribe()

> **subscribe**(`patterns`, `handler`, `options?`): `Promise`\<[`EventSubscription`](EventSubscription.md)\>

Defined in: [packages/events/src/types.ts:92](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L92)

Subscribe to event patterns with a raw handler

#### Parameters

##### patterns

`string`[]

##### handler

[`RawEventHandler`](../type-aliases/RawEventHandler.md)

##### options?

[`RawSubscribeOptions`](RawSubscribeOptions.md)

#### Returns

`Promise`\<[`EventSubscription`](EventSubscription.md)\>
