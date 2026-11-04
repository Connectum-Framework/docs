[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ClientStreamHandle

# Interface: ClientStreamHandle\<Req, Res\>

Defined in: [packages/core/src/context.ts:84](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L84)

Push handle for a client-streaming catalog call: send N requests, then
`close()` to receive the single aggregated response.

## Type Parameters

### Req

`Req`

### Res

`Res`

## Methods

### close()

> **close**(): `Promise`\<`Res`\>

Defined in: [packages/core/src/context.ts:102](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L102)

End the request stream and resolve with the server's single response.

Settles only when the call has finished, not when the response arrives:
it rejects if the stream ends without a response, carries more than one,
or fails after the response (the failure is what the call reports).
A server that delays its final status therefore holds `close()` until
that status arrives, the call is canceled or its deadline passes.

#### Returns

`Promise`\<`Res`\>

***

### send()

> **send**(`request`): `void`

Defined in: [packages/core/src/context.ts:92](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L92)

Enqueue one request message.

#### Parameters

##### request

`Req`

#### Returns

`void`

#### Throws

ConnectError with `Code.FailedPrecondition` when called after
[ClientStreamHandle.close](#close): the request stream is already ended, so
the message could not be delivered and is refused instead of lost.
