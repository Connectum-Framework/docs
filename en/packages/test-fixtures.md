---
title: '@connectum/test-fixtures'
description: Transport-free mock factories, assertion helpers, and protobuf descriptor fixtures
---

# @connectum/test-fixtures

Lightweight mock factories, assertion helpers, and protobuf descriptor fixtures
shared across the `@connectum/*` test suites.

**Layer**: 2 (Testing Utilities)

This package is **transport-free** — it does not depend on `@connectum/core`,
`@connectum/interceptors`, or any other Connectum package. That keeps the
workspace dependency graph acyclic and lets every Connectum package depend on it
without build cycles.

::: tip Related
- [@connectum/testing](/en/packages/testing) -- higher-level test server, in-process transport, OTel collectors, parity driver (re-exports everything here)
- [Testing](/en/guide/testing) -- testing strategies and tools
:::

::: tip Full API Reference
Complete TypeScript API documentation: [API Reference](/en/api/@connectum/test-fixtures/)
:::

## Installation

```bash
pnpm add -D @connectum/test-fixtures
```

**Requires**: Node.js 22.13+

**Peer dependencies**: `@connectrpc/connect`, `@bufbuild/protobuf`

Most consumers do not install this directly — [@connectum/testing](/en/packages/testing)
re-exports every symbol from it, so importing from `@connectum/testing` continues
to work unchanged.

## What lives here

| Export | Purpose |
|--------|---------|
| `assertConnectError` | Assertion helper for thrown `ConnectError` values (code + message). |
| `createMockFn` | Portable, `node:test`-free spy factory (works under Bun/esbuild). |
| `createMockRequest` | Fake unary ConnectRPC request. |
| `createMockNext`, `createMockNextError`, `createMockNextSlow` | Fake `next` handlers for interceptor tests. |
| `createMockStream` | Async iterable for streaming tests. |
| `createMockDescMessage`, `createMockDescField`, `createMockDescMethod` | Protobuf descriptor mocks. |
| `createFakeService`, `createFakeMethod` | Generic `DescService` / `DescMethod` fixtures. |

## Example

```ts
import { assertConnectError, createMockRequest } from "@connectum/test-fixtures";
import { Code, ConnectError } from "@connectrpc/connect";

assertConnectError(
    new ConnectError("not found", Code.NotFound),
    Code.NotFound,
    "not found",
);
```
