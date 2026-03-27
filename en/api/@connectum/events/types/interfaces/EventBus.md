[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventBus

# Interface: EventBus

Defined in: [packages/events/src/types.ts:316](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L316)

EventBus interface -- manages adapter, routes, and middleware

## Methods

### publish()

> **publish**\<`Desc`\>(`schema`, `data`, `options?`): `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:330](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L330)

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

Defined in: [packages/events/src/types.ts:326](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L326)

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

Defined in: [packages/events/src/types.ts:328](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L328)

Stop the event bus: drain subscriptions, disconnect adapter

#### Returns

`Promise`\<`void`\>
