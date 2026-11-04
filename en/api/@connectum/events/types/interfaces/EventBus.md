[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventBus

# Interface: EventBus

Defined in: [packages/events/src/types.ts:550](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L550)

EventBus interface -- manages adapter, routes, and middleware

## Methods

### publish()

> **publish**\<`Desc`\>(`schema`, `data`, `options?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:567](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L567)

Publish a typed event. `data` is `MessageInitShape` of the schema: a plain object
(nested messages and oneofs included) or an already built message.

#### Type Parameters

##### Desc

`Desc` *extends* [`DescMessage`](https://protobufes.com/reference/reflection/descriptors/#types)

#### Parameters

##### schema

`Desc`

##### data

`MessageInitShape`\<`Desc`\>

##### options?

[`PublishOptions`](PublishOptions.md)

#### Returns

`Promise`\<`void`\>

***

### start()

> **start**(`options?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:560](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L560)

Start the event bus: connect adapter, set up subscriptions.

An optional `signal` can be passed for graceful shutdown.
If provided, it **overrides** the construction-time `EventBusOptions.signal`.
The active signal is then composed with `AbortSignal.timeout(handlerTimeout)`
via `AbortSignal.any()` for each event handler invocation, so either
shutdown or per-event timeout will abort in-flight processing.

#### Parameters

##### options?

###### signal?

`AbortSignal`

#### Returns

`Promise`\<`void`\>

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:562](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L562)

Stop the event bus: drain subscriptions, disconnect adapter

#### Returns

`Promise`\<`void`\>
