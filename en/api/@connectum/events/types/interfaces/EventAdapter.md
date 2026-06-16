[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventAdapter

# Interface: EventAdapter

Defined in: [packages/events/src/types.ts:97](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events/src/types.ts#L97)

Minimal adapter interface for message brokers.

Inspired by Watermill (Go): minimal surface, broker-specific
config in constructor, not in interface methods.

## Properties

### name

> `readonly` **name**: `string`

Defined in: [packages/events/src/types.ts:99](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events/src/types.ts#L99)

Adapter name for identification (e.g., "nats", "kafka", "redis", "memory")

## Methods

### connect()

> **connect**(`context?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:108](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events/src/types.ts#L108)

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

Defined in: [packages/events/src/types.ts:111](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events/src/types.ts#L111)

Disconnect from the message broker

#### Returns

`Promise`\<`void`\>

***

### publish()

> **publish**(`eventType`, `payload`, `options?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:114](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events/src/types.ts#L114)

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

Defined in: [packages/events/src/types.ts:117](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events/src/types.ts#L117)

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
