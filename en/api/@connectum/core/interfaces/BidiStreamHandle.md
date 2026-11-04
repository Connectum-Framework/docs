[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / BidiStreamHandle

# Interface: BidiStreamHandle\<Req, Res\>

Defined in: [packages/core/src/context.ts:110](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L110)

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

Defined in: [packages/core/src/context.ts:131](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L131)

The server's response messages, in order.

The iterable is **single-use**: every iteration reads the same underlying
stream. Two loops running over `responses` at the same time split the
messages between them, and each message reaches exactly one of them. Once
a loop has finished, or has left early with `break`, the stream is over:
a loop started afterwards receives nothing. Iterate it once, in one
place, and fan the messages out yourself if several consumers need them.

## Methods

### close()

> **close**(): `void`

Defined in: [packages/core/src/context.ts:120](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L120)

End the request (send) half; the response half is unaffected. Calling it again has no effect.

#### Returns

`void`

***

### send()

> **send**(`request`): `void`

Defined in: [packages/core/src/context.ts:118](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L118)

Enqueue one request message.

#### Parameters

##### request

`Req`

#### Returns

`void`

#### Throws

ConnectError with `Code.FailedPrecondition` when called after
[BidiStreamHandle.close](#close): the send half is already ended, so the
message could not be delivered and is refused instead of lost.
