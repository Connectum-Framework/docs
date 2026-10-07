[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / StreamReturn

# Type Alias: StreamReturn\<E\>

> **StreamReturn**\<`E`\> = `E` *extends* `object` ? (`request`, `options?`) => [`AsyncIterable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols)\<`Res`\> : `E` *extends* `object` ? (`options?`) => [`ClientStreamHandle`](../interfaces/ClientStreamHandle.md)\<`Req`, `Res`\> : `E` *extends* `object` ? (`options?`) => [`BidiStreamHandle`](../interfaces/BidiStreamHandle.md)\<`Req`, `Res`\> : `never`

Defined in: [packages/core/src/context.ts:104](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L104)

Maps a [ConnectumStreamMap](../interfaces/ConnectumStreamMap.md) entry to the ergonomic shape returned by
[Context.stream](../interfaces/Context.md#stream), discriminated by the entry's `kind`.

- `kind: "server-stream"`: `(request, options?) => AsyncIterable<response>`.
- `kind: "client-stream"`: `(options?) => ClientStreamHandle<request, response>`.
- `kind: "bidi"`: `(options?) => BidiStreamHandle<request, response>`.

Request and response types are inferred from the entry's `request` and
`response` fields; an entry matching none of these branches maps to `never`.

## Type Parameters

### E

`E`
