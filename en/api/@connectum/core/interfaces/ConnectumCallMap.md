[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ConnectumCallMap

# Interface: ConnectumCallMap

Defined in: [packages/core/src/serviceCatalog.ts:31](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/serviceCatalog.ts#L31)

Module-augmentation target for type-safe **unary** `ctx.call(method, request)`.

`@connectum/protoc-gen-catalog` augments this with one entry per unary RPC,
keyed `"<typeName>/<method>"` → `{ request; response }`. It starts empty so
that a project with no generated catalog still type-checks (calls are then
untyped rather than a hard error).
