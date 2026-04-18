[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ShutdownHook

# Type Alias: ShutdownHook

> **ShutdownHook** = () => `void` \| `Promise`\<`void`\>

Defined in: [packages/core/src/types.ts:39](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/core/src/types.ts#L39)

Shutdown hook function type

A function called during graceful shutdown. May be synchronous or async.

## Returns

`void` \| `Promise`\<`void`\>
