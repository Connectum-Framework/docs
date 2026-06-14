[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ConnectumMethodImpl

# Type Alias: ConnectumMethodImpl\<M\>

> **ConnectumMethodImpl**\<`M`\> = `M` *extends* `DescMethodUnary`\<infer I, infer O\> ? (`request`, `context`) => `Promise`\<`MessageInitShape`\<`O`\>\> \| `MessageInitShape`\<`O`\> : `M` *extends* `DescMethodServerStreaming`\<infer I, infer O\> ? (`request`, `context`) => `AsyncIterable`\<`MessageInitShape`\<`O`\>\> : `M` *extends* `DescMethodClientStreaming`\<infer I, infer O\> ? (`requests`, `context`) => `Promise`\<`MessageInitShape`\<`O`\>\> : `M` *extends* `DescMethodBiDiStreaming`\<infer I, infer O\> ? (`requests`, `context`) => `AsyncIterable`\<`MessageInitShape`\<`O`\>\> : `never`

Defined in: [packages/core/src/context.ts:145](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/context.ts#L145)

The implementation of a single RPC, receiving a Connectum [Context](../interfaces/Context.md).

Mirrors `@connectrpc/connect`'s `MethodImpl` but substitutes `Context` for
the raw `HandlerContext`, so `ctx.call` is visible inside handlers.

## Type Parameters

### M

`M` *extends* `DescMethod`
