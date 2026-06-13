[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ServerClientOptions

# Interface: ServerClientOptions

Defined in: [packages/core/src/types.ts:614](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/types.ts#L614)

Options for [Server.client](Server.md#client).

## Properties

### fallback?

> `optional` **fallback?**: `Transport`

Defined in: [packages/core/src/types.ts:622](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/types.ts#L622)

Transport used when the requested service is NOT registered on this
`Server`. Typically a remote HTTP/gRPC transport.

If omitted and the service is not local, `Server.client()` throws
`ConnectError` with `Code.Unimplemented`.
