[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventBus

# Interface: EventBus

Defined in: [packages/events/src/types.ts:331](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events/src/types.ts#L331)

EventBus interface -- manages adapter, routes, and middleware

## Methods

### publish()

> **publish**\<`Desc`\>(`schema`, `data`, `options?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:345](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events/src/types.ts#L345)

Publish a typed event

#### Type Parameters

##### Desc

`Desc` *extends* `DescMessage`

#### Parameters

##### schema

`Desc`

##### data

`MessageShape`\<`Desc`\>

##### options?

[`PublishOptions`](PublishOptions.md)

#### Returns

`Promise`\<`void`\>

***

### start()

> **start**(`options?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:341](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events/src/types.ts#L341)

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

Defined in: [packages/events/src/types.ts:343](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events/src/types.ts#L343)

Stop the event bus: drain subscriptions, disconnect adapter

#### Returns

`Promise`\<`void`\>
