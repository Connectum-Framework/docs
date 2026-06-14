[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ShutdownHook

# Type Alias: ShutdownHook

> **ShutdownHook** = () => `void` \| `Promise`\<`void`\>

Defined in: [packages/core/src/types.ts:40](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/types.ts#L40)

Shutdown hook function type

A function called during graceful shutdown. May be synchronous or async.

## Returns

`void` \| `Promise`\<`void`\>
