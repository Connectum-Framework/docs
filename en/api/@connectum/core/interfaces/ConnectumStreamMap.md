[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ConnectumStreamMap

# Interface: ConnectumStreamMap

Defined in: [packages/core/src/serviceCatalog.ts:42](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/serviceCatalog.ts#L42)

Module-augmentation target for type-safe **streaming** `ctx.stream(method, ...)`.

Augmented per streaming RPC, keyed `"<typeName>/<method>"` →
`{ request; response; kind }` where `kind` is `"server-stream"`,
`"client-stream"`, or `"bidi"`. Unary RPCs never appear here — they go to
[ConnectumCallMap](ConnectumCallMap.md).

## Properties

### streaming.v1.StreamingService/Bidi

> **streaming.v1.StreamingService/Bidi**: `object`

Defined in: [packages/core/tests/integration/ctxStream.test.ts:28](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/tests/integration/ctxStream.test.ts#L28)

#### kind

> **kind**: `"bidi"`

#### request

> **request**: `Item`

#### response

> **response**: `Item`

***

### streaming.v1.StreamingService/Client

> **streaming.v1.StreamingService/Client**: `object`

Defined in: [packages/core/tests/integration/ctxStream.test.ts:27](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/tests/integration/ctxStream.test.ts#L27)

#### kind

> **kind**: `"client-stream"`

#### request

> **request**: `Item`

#### response

> **response**: `Count`

***

### streaming.v1.StreamingService/Server

> **streaming.v1.StreamingService/Server**: `object`

Defined in: [packages/core/tests/integration/ctxStream.test.ts:26](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/tests/integration/ctxStream.test.ts#L26)

#### kind

> **kind**: `"server-stream"`

#### request

> **request**: `Item`

#### response

> **response**: `Item`
