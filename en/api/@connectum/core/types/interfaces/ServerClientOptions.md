[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ServerClientOptions

# Interface: ServerClientOptions

Defined in: [packages/core/src/types.ts:567](https://github.com/Connectum-Framework/connectum/blob/9c808efa603eaacdf10ddef6780ea699f46a1f35/packages/core/src/types.ts#L567)

Options for [Server.client](Server.md#client).

## Properties

### fallback?

> `optional` **fallback?**: `Transport`

Defined in: [packages/core/src/types.ts:575](https://github.com/Connectum-Framework/connectum/blob/9c808efa603eaacdf10ddef6780ea699f46a1f35/packages/core/src/types.ts#L575)

Transport used when the requested service is NOT registered on this
`Server`. Typically a remote HTTP/gRPC transport.

If omitted and the service is not local, `Server.client()` throws
`ConnectError` with `Code.Unimplemented`.
