[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / CreateCatalogClientOptions

# Interface: CreateCatalogClientOptions

Defined in: [packages/core/src/catalogClient.ts:46](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/catalogClient.ts#L46)

Options for [createCatalogClient](../functions/createCatalogClient.md).

## Properties

### catalog

> **catalog**: [`ServiceCatalog`](../type-aliases/ServiceCatalog.md)

Defined in: [packages/core/src/catalogClient.ts:51](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/catalogClient.ts#L51)

The service catalog (a `Record<typeName, DescService>`) that backs typed
dispatch — the same object passed to `createServer({ catalog })`.

***

### resolver

> **resolver**: [`RemoteResolver`](../type-aliases/RemoteResolver.md)

Defined in: [packages/core/src/catalogClient.ts:58](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/catalogClient.ts#L58)

Maps a target service `typeName` to a ConnectRPC `Transport`. Required:
unlike a `Server`, a catalog client has no in-process/local path, so every
call is routed through the resolver. A resolver that returns `null` for a
target makes that call fail with `Code.Unavailable`.
