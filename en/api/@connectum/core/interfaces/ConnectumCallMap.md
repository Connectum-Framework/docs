[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ConnectumCallMap

# Interface: ConnectumCallMap

Defined in: [packages/core/src/serviceCatalog.ts:31](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/serviceCatalog.ts#L31)

Module-augmentation target for type-safe **unary** `ctx.call(method, request)`.

`@connectum/protoc-gen-catalog` augments this with one entry per unary RPC,
keyed `"<typeName>/<method>"` → `{ request; response }`. It starts empty so
that a project with no generated catalog still type-checks (calls are then
untyped rather than a hard error).

## Properties

### echo.v1.EchoService/Echo

> **echo.v1.EchoService/Echo**: `object`

Defined in: [packages/core/tests/integration/catalogClient.test.ts:37](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/tests/integration/catalogClient.test.ts#L37)

#### request

> **request**: `EchoRequest`

#### response

> **response**: `EchoResponse`

***

### echo.v1.EchoService/Nope

> **echo.v1.EchoService/Nope**: `object`

Defined in: [packages/core/tests/integration/ctxCall.test.ts:34](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/tests/integration/ctxCall.test.ts#L34)

#### request

> **request**: `EchoRequest`

#### response

> **response**: `EchoResponse`

***

### echo.v1.EchoService/RateLimitedEcho

> **echo.v1.EchoService/RateLimitedEcho**: `object`

Defined in: [packages/core/tests/integration/ctxCallErrorTrailers.test.ts:23](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/tests/integration/ctxCallErrorTrailers.test.ts#L23)

#### request

> **request**: `EchoRequest`

#### response

> **response**: `EchoResponse`

***

### ghost.v1.GhostService/Vanish

> **ghost.v1.GhostService/Vanish**: `object`

Defined in: [packages/core/tests/integration/ctxCall.test.ts:33](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/tests/integration/ctxCall.test.ts#L33)

#### request

> **request**: `EchoRequest`

#### response

> **response**: `EchoResponse`

***

### phantom.v1.PhantomService/Vanish

> **phantom.v1.PhantomService/Vanish**: `object`

Defined in: [packages/core/tests/integration/catalogClient.test.ts:38](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/tests/integration/catalogClient.test.ts#L38)

#### request

> **request**: `Item`

#### response

> **response**: `Item`

***

### streaming.v1.StreamingService/Absent

> **streaming.v1.StreamingService/Absent**: `object`

Defined in: [packages/core/tests/integration/catalogClient.test.ts:39](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/tests/integration/catalogClient.test.ts#L39)

#### request

> **request**: `Item`

#### response

> **response**: `Item`

***

### streaming.v1.StreamingService/Echo

> **streaming.v1.StreamingService/Echo**: `object`

Defined in: [packages/core/tests/integration/catalogClient.test.ts:36](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/tests/integration/catalogClient.test.ts#L36)

#### request

> **request**: `Item`

#### response

> **response**: `Item`
