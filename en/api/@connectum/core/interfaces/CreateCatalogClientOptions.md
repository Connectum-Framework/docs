[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / CreateCatalogClientOptions

# Interface: CreateCatalogClientOptions

Defined in: [packages/core/src/catalogClient.ts:48](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/catalogClient.ts#L48)

Options for [createCatalogClient](../functions/createCatalogClient.md).

## Properties

### catalog

> **catalog**: [`ServiceCatalog`](../type-aliases/ServiceCatalog.md)

Defined in: [packages/core/src/catalogClient.ts:53](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/catalogClient.ts#L53)

The service catalog (a `Record<typeName, DescService>`) that backs typed
dispatch — the same object passed to `createServer({ catalog })`.

***

### outgoingInterceptors?

> `optional` **outgoingInterceptors?**: readonly `Interceptor`[]

Defined in: [packages/core/src/catalogClient.ts:70](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/catalogClient.ts#L70)

Client-side interceptors applied once around every `call`/`stream` this
client makes, outside the interceptors of the resolver's transport.
Empty by default: a standalone client has no `Server` to inherit a chain
from, and a resolver whose transports already carry the application's
policy keeps working unchanged. Do not configure the same policy here and
on the resolver's transport — the framework cannot see inside a
`Transport` and would run it twice.

***

### resolver

> **resolver**: [`RemoteResolver`](../type-aliases/RemoteResolver.md)

Defined in: [packages/core/src/catalogClient.ts:60](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/catalogClient.ts#L60)

Maps a target service `typeName` to a ConnectRPC `Transport`. Required:
unlike a `Server`, a catalog client has no in-process/local path, so every
call is routed through the resolver. A resolver that returns `null` for a
target makes that call fail with `Code.Unavailable`.
