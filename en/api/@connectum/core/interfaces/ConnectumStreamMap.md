[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ConnectumStreamMap

# Interface: ConnectumStreamMap

Defined in: [packages/core/src/serviceCatalog.ts:42](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/serviceCatalog.ts#L42)

Module-augmentation target for type-safe **streaming** `ctx.stream(method, ...)`.

Augmented per streaming RPC, keyed `"<typeName>/<method>"` →
`{ request; response; kind }` where `kind` is `"server-stream"`,
`"client-stream"`, or `"bidi"`. Unary RPCs never appear here — they go to
[ConnectumCallMap](ConnectumCallMap.md).
