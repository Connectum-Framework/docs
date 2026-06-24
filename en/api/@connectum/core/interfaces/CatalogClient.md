[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / CatalogClient

# Interface: CatalogClient

Defined in: [packages/core/src/catalogClient.ts:67](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/catalogClient.ts#L67)

A standalone, catalog-typed client. Exposes the SAME `call` (unary) and
`stream` (server/client/bidi) surface as the handler [Context](Context.md), keyed
off [ConnectumCallMap](ConnectumCallMap.md)/[ConnectumStreamMap](ConnectumStreamMap.md), without constructing
a `Server`.

## Properties

### call

> **call**: [`CatalogCall`](../type-aliases/CatalogCall.md)

Defined in: [packages/core/src/catalogClient.ts:78](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/catalogClient.ts#L78)

Invoke a unary service in the catalog over the resolver-supplied
transport. With no augmentation of [ConnectumCallMap](ConnectumCallMap.md) this is
statically uncallable — exactly as on the handler `ctx`.

Errors mirror `ctx.call`: no catalog / unknown service / unknown method /
wrong kind → `Code.FailedPrecondition`/`Code.Unimplemented`; resolver
returns `null` → `Code.Unavailable`; resolver throws → `Code.Internal`
(cause preserved).

***

### stream

> **stream**: [`CatalogStream`](../type-aliases/CatalogStream.md)

Defined in: [packages/core/src/catalogClient.ts:85](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/catalogClient.ts#L85)

Open a streaming call to a service in the catalog over the
resolver-supplied transport. Returns the same kind-specific factory as
`ctx.stream` (server-streaming → `AsyncIterable`; client-/bidi-streaming →
push handles).
