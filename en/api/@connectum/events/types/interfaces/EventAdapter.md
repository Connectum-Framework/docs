[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventAdapter

# Interface: EventAdapter

Defined in: [packages/events/src/types.ts:120](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L120)

Minimal adapter interface for message brokers.

Inspired by Watermill (Go): minimal surface, broker-specific
config in constructor, not in interface methods.

## Properties

### name

> `readonly` **name**: `string`

Defined in: [packages/events/src/types.ts:122](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L122)

Adapter name for identification (e.g., "nats", "kafka", "redis", "memory")

## Methods

### connect()

> **connect**(`context?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:131](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L131)

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

Defined in: [packages/events/src/types.ts:134](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L134)

Disconnect from the message broker

#### Returns

`Promise`\<`void`\>

***

### publish()

> **publish**(`eventType`, `payload`, `options?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:137](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L137)

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

Defined in: [packages/events/src/types.ts:140](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L140)

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
