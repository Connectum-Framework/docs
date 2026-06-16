[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ClientStreamHandle

# Interface: ClientStreamHandle\<Req, Res\>

Defined in: [packages/core/src/context.ts:72](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/src/context.ts#L72)

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

Defined in: [packages/core/src/context.ts:76](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/src/context.ts#L76)

End the request stream and resolve with the server's single response.

#### Returns

`Promise`\<`Res`\>

***

### send()

> **send**(`request`): `void`

Defined in: [packages/core/src/context.ts:74](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/src/context.ts#L74)

Enqueue one request message.

#### Parameters

##### request

`Req`

#### Returns

`void`
