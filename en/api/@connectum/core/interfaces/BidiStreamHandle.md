[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / BidiStreamHandle

# Interface: BidiStreamHandle\<Req, Res\>

Defined in: [packages/core/src/context.ts:92](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L92)

Push handle for a bidi-streaming catalog call: `send()` requests while
iterating `responses`; `close()` ends only the request (send) half — the
response half keeps yielding until the server completes.

## Type Parameters

### Req

`Req`

### Res

`Res`

## Properties

### responses

> `readonly` **responses**: [`AsyncIterable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols)\<`Res`\>

Defined in: [packages/core/src/context.ts:98](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L98)

The server's response messages, in order.

## Methods

### close()

> **close**(): `void`

Defined in: [packages/core/src/context.ts:96](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L96)

End the request (send) half; the response half is unaffected.

#### Returns

`void`

***

### send()

> **send**(`request`): `void`

Defined in: [packages/core/src/context.ts:94](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L94)

Enqueue one request message.

#### Parameters

##### request

`Req`

#### Returns

`void`
