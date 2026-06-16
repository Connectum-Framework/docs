[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / BidiStreamHandle

# Interface: BidiStreamHandle\<Req, Res\>

Defined in: [packages/core/src/context.ts:84](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/src/context.ts#L84)

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

> `readonly` **responses**: `AsyncIterable`\<`Res`\>

Defined in: [packages/core/src/context.ts:90](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/src/context.ts#L90)

The server's response messages, in order.

## Methods

### close()

> **close**(): `void`

Defined in: [packages/core/src/context.ts:88](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/src/context.ts#L88)

End the request (send) half; the response half is unaffected.

#### Returns

`void`

***

### send()

> **send**(`request`): `void`

Defined in: [packages/core/src/context.ts:86](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/src/context.ts#L86)

Enqueue one request message.

#### Parameters

##### request

`Req`

#### Returns

`void`
