[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventAdapter

# Interface: EventAdapter

Defined in: [packages/events/src/types.ts:99](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L99)

Minimal adapter interface for message brokers.

Inspired by Watermill (Go): minimal surface, broker-specific
config in constructor, not in interface methods.

## Properties

### name

> `readonly` **name**: `string`

Defined in: [packages/events/src/types.ts:101](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L101)

Adapter name for identification (e.g., "nats", "kafka", "redis", "memory")

## Methods

### connect()

> **connect**(`context?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:110](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L110)

Connect to the message broker.

#### Parameters

##### context?

[`AdapterContext`](AdapterContext.md)

Optional adapter context with service-level information
  derived from proto service descriptors. Adapters may use
  `context.serviceName` for broker-level client identification.

#### Returns

`Promise`\<`void`\>

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:113](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L113)

Disconnect from the message broker

#### Returns

`Promise`\<`void`\>

***

### publish()

> **publish**(`eventType`, `payload`, `options?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:116](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L116)

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

Defined in: [packages/events/src/types.ts:119](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L119)

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
