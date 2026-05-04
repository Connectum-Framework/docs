[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / EventBusLike

# Interface: EventBusLike

Defined in: [packages/core/src/types.ts:126](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L126)

Minimal interface for event bus lifecycle integration with the server.

Packages implementing event bus adapters (e.g., @connectum/events)
must satisfy this interface to be used with `createServer({ eventBus })`.

## Methods

### start()

> **start**(`options?`): `Promise`\<`void`\>

Defined in: [packages/core/src/types.ts:133](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L133)

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

Defined in: [packages/core/src/types.ts:135](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L135)

Stop the event bus (drain subscriptions, disconnect)

#### Returns

`Promise`\<`void`\>
