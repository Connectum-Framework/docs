[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ConnectumCallMap

# Interface: ConnectumCallMap

Defined in: [packages/core/src/serviceCatalog.ts:31](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/src/serviceCatalog.ts#L31)

Module-augmentation target for type-safe **unary** `ctx.call(method, request)`.

`@connectum/protoc-gen-catalog` augments this with one entry per unary RPC,
keyed `"<typeName>/<method>"` → `{ request; response }`. It starts empty so
that a project with no generated catalog still type-checks (calls are then
untyped rather than a hard error).

## Properties

### echo.v1.EchoService/Echo

> **echo.v1.EchoService/Echo**: `object`

Defined in: [packages/core/tests/integration/ctxCall.test.ts:31](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/tests/integration/ctxCall.test.ts#L31)

#### request

> **request**: `EchoRequest`

#### response

> **response**: `EchoResponse`

***

### echo.v1.EchoService/Nope

> **echo.v1.EchoService/Nope**: `object`

Defined in: [packages/core/tests/integration/ctxCall.test.ts:34](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/tests/integration/ctxCall.test.ts#L34)

#### request

> **request**: `EchoRequest`

#### response

> **response**: `EchoResponse`

***

### echo.v1.EchoService/RateLimitedEcho

> **echo.v1.EchoService/RateLimitedEcho**: `object`

Defined in: [packages/core/tests/integration/ctxCallErrorTrailers.test.ts:23](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/tests/integration/ctxCallErrorTrailers.test.ts#L23)

#### request

> **request**: `EchoRequest`

#### response

> **response**: `EchoResponse`

***

### ghost.v1.GhostService/Vanish

> **ghost.v1.GhostService/Vanish**: `object`

Defined in: [packages/core/tests/integration/ctxCall.test.ts:33](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/tests/integration/ctxCall.test.ts#L33)

#### request

> **request**: `EchoRequest`

#### response

> **response**: `EchoResponse`

***

### streaming.v1.StreamingService/Echo

> **streaming.v1.StreamingService/Echo**: `object`

Defined in: [packages/core/tests/integration/ctxCall.test.ts:32](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/tests/integration/ctxCall.test.ts#L32)

#### request

> **request**: `Item`

#### response

> **response**: `Item`
