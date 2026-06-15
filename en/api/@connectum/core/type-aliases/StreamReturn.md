[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / StreamReturn

# Type Alias: StreamReturn\<E\>

> **StreamReturn**\<`E`\> = `E` *extends* `object` ? (`request`, `options?`) => `AsyncIterable`\<`Res`\> : `E` *extends* `object` ? (`options?`) => [`ClientStreamHandle`](../interfaces/ClientStreamHandle.md)\<`Req`, `Res`\> : `E` *extends* `object` ? (`options?`) => [`BidiStreamHandle`](../interfaces/BidiStreamHandle.md)\<`Req`, `Res`\> : `never`

Defined in: [packages/core/src/context.ts:97](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/context.ts#L97)

Maps a [ConnectumStreamMap](../interfaces/ConnectumStreamMap.md) entry to the ergonomic shape returned by
[Context.stream](../interfaces/Context.md#stream), discriminated by the entry's `kind`.

## Type Parameters

### E

`E`
