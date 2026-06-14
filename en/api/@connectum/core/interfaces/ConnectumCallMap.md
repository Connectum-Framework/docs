[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ConnectumCallMap

# Interface: ConnectumCallMap

Defined in: [packages/core/src/serviceCatalog.ts:31](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/serviceCatalog.ts#L31)

Module-augmentation target for type-safe **unary** `ctx.call(method, request)`.

`@connectum/protoc-gen-catalog` augments this with one entry per unary RPC,
keyed `"<typeName>/<method>"` → `{ request; response }`. It starts empty so
that a project with no generated catalog still type-checks (calls are then
untyped rather than a hard error).

## Properties

### echo.v1.EchoService/Echo

> **echo.v1.EchoService/Echo**: `object`

Defined in: [packages/core/tests/integration/ctxCall.test.ts:31](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/tests/integration/ctxCall.test.ts#L31)

#### request

> **request**: `EchoRequest`

#### response

> **response**: `EchoResponse`

***

### echo.v1.EchoService/Nope

> **echo.v1.EchoService/Nope**: `object`

Defined in: [packages/core/tests/integration/ctxCall.test.ts:34](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/tests/integration/ctxCall.test.ts#L34)

#### request

> **request**: `EchoRequest`

#### response

> **response**: `EchoResponse`

***

### ghost.v1.GhostService/Vanish

> **ghost.v1.GhostService/Vanish**: `object`

Defined in: [packages/core/tests/integration/ctxCall.test.ts:33](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/tests/integration/ctxCall.test.ts#L33)

#### request

> **request**: `EchoRequest`

#### response

> **response**: `EchoResponse`

***

### streaming.v1.StreamingService/Echo

> **streaming.v1.StreamingService/Echo**: `object`

Defined in: [packages/core/tests/integration/ctxCall.test.ts:32](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/tests/integration/ctxCall.test.ts#L32)

#### request

> **request**: `Item`

#### response

> **response**: `Item`
