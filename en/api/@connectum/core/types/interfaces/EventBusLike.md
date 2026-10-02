[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / EventBusLike

# Interface: EventBusLike

Defined in: [packages/core/src/types.ts:180](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L180)

Minimal interface for event bus lifecycle integration with the server.

Packages implementing event bus adapters (e.g., @connectum/events)
must satisfy this interface to be used with `createServer({ eventBus })`.

## Methods

### start()

> **start**(`options?`): `Promise`\<`void`\>

Defined in: [packages/core/src/types.ts:187](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L187)

Start the event bus (connect to broker, set up subscriptions).

#### Parameters

##### options?

Optional start parameters

###### signal?

`AbortSignal`

Abort signal from server for graceful shutdown

#### Returns

`Promise`\<`void`\>

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [packages/core/src/types.ts:189](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L189)

Stop the event bus (drain subscriptions, disconnect)

#### Returns

`Promise`\<`void`\>
