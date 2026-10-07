[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ConnectumMethodImpl

# Type Alias: ConnectumMethodImpl\<M\>

> **ConnectumMethodImpl**\<`M`\> = `M` *extends* `DescMethodUnary`\<infer I, infer O\> ? (`request`, `context`) => `Promise`\<`MessageInitShape`\<`O`\>\> \| `MessageInitShape`\<`O`\> : `M` *extends* `DescMethodServerStreaming`\<infer I, infer O\> ? (`request`, `context`) => [`AsyncIterable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols)\<`MessageInitShape`\<`O`\>\> : `M` *extends* `DescMethodClientStreaming`\<infer I, infer O\> ? (`requests`, `context`) => `Promise`\<`MessageInitShape`\<`O`\>\> : `M` *extends* `DescMethodBiDiStreaming`\<infer I, infer O\> ? (`requests`, `context`) => [`AsyncIterable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols)\<`MessageInitShape`\<`O`\>\> : `never`

Defined in: [packages/core/src/context.ts:171](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L171)

The implementation of a single RPC, receiving a Connectum [Context](../interfaces/Context.md).

Mirrors `@connectrpc/connect`'s `MethodImpl` but substitutes `Context` for
the raw `HandlerContext`, so `ctx.call` is visible inside handlers.

## Type Parameters

### M

`M` *extends* [`DescMethod`](https://protobufes.com/reference/reflection/descriptors/#types)
