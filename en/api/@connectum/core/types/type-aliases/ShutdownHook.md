[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ShutdownHook

# Type Alias: ShutdownHook

> **ShutdownHook** = () => `void` \| `Promise`\<`void`\>

Defined in: [packages/core/src/types.ts:39](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/types.ts#L39)

Shutdown hook function type

A function called during graceful shutdown. May be synchronous or async.

## Returns

`void` \| `Promise`\<`void`\>
