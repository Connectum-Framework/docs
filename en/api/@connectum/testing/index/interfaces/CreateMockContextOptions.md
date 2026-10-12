[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / CreateMockContextOptions

# Interface: CreateMockContextOptions

Defined in: [testing/src/mockContext.ts:21](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/mockContext.ts#L21)

Options for [createMockContext](../functions/createMockContext.md).

## Properties

### catalog

> `readonly` **catalog**: `ServiceCatalog`

Defined in: [testing/src/mockContext.ts:23](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/mockContext.ts#L23)

The catalog the handler-under-test calls into.

***

### mocks

> `readonly` **mocks**: readonly [`MockService`](MockService.md)[]

Defined in: [testing/src/mockContext.ts:25](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/mockContext.ts#L25)

Mock implementations served via the catalog's resolver path.

***

### outgoingInterceptors?

> `readonly` `optional` **outgoingInterceptors?**: readonly `Interceptor`[]

Defined in: [testing/src/mockContext.ts:27](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/mockContext.ts#L27)

Optional outgoing interceptors (applied exactly as in production).

***

### propagateHeaders?

> `readonly` `optional` **propagateHeaders?**: readonly `string`[]

Defined in: [testing/src/mockContext.ts:33](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/mockContext.ts#L33)

Optional header names propagated onto outgoing calls (default none).

***

### requestHeader?

> `readonly` `optional` **requestHeader?**: `HeadersInit`

Defined in: [testing/src/mockContext.ts:29](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/mockContext.ts#L29)

Optional inbound headers (seen by `ctx.requestHeader` + header propagation).

***

### timeoutMs?

> `readonly` `optional` **timeoutMs?**: `number`

Defined in: [testing/src/mockContext.ts:31](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/mockContext.ts#L31)

Optional inbound deadline in ms (drives the `ctx.timeoutMs()` cascade).
