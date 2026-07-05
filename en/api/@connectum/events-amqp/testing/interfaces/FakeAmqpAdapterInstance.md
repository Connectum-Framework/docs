[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [testing](../index.md) / FakeAmqpAdapterInstance

# Interface: FakeAmqpAdapterInstance

Defined in: [packages/events-amqp/src/testing.ts:144](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L144)

The fake adapter: a drop-in EventAdapter plus its [FakeAmqpControl](FakeAmqpControl.md).

## Extends

- `EventAdapter`

## Properties

### control

> `readonly` **control**: [`FakeAmqpControl`](FakeAmqpControl.md)

Defined in: [packages/events-amqp/src/testing.ts:145](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L145)

***

### name

> `readonly` **name**: `string`

Defined in: packages/events/dist/index.d.ts:105

Adapter name for identification (e.g., "nats", "kafka", "redis", "memory")

#### Inherited from

`EventAdapter.name`

## Methods

### connect()

> **connect**(`context?`): `Promise`\<`void`\>

Defined in: packages/events/dist/index.d.ts:113

Connect to the message broker.

#### Parameters

##### context?

`AdapterContext`

Optional adapter context with service-level information
  derived from proto service descriptors. Adapters may use
  `context.serviceName` for broker-level client identification.

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EventAdapter.connect`

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Defined in: packages/events/dist/index.d.ts:115

Disconnect from the message broker

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EventAdapter.disconnect`

***

### publish()

> **publish**(`eventType`, `payload`, `options?`): `Promise`\<`void`\>

Defined in: packages/events/dist/index.d.ts:117

Publish a serialized event to a topic

#### Parameters

##### eventType

`string`

##### payload

`Uint8Array`

##### options?

`PublishOptions`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EventAdapter.publish`

***

### subscribe()

> **subscribe**(`patterns`, `handler`, `options?`): `Promise`\<`EventSubscription`\>

Defined in: packages/events/dist/index.d.ts:119

Subscribe to event patterns with a raw handler

#### Parameters

##### patterns

`string`[]

##### handler

`RawEventHandler`

##### options?

`RawSubscribeOptions`

#### Returns

`Promise`\<`EventSubscription`\>

#### Inherited from

`EventAdapter.subscribe`
