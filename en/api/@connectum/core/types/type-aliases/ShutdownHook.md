[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ShutdownHook

# Type Alias: ShutdownHook

> **ShutdownHook** = () => `void` \| `Promise`\<`void`\>

Defined in: [packages/core/src/types.ts:39](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L39)

Shutdown hook function type

A function called during graceful shutdown. May be synchronous or async.

## Returns

`void` \| `Promise`\<`void`\>
