[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / CreateMockContextOptions

# Interface: CreateMockContextOptions

Defined in: [testing/src/mockContext.ts:22](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/testing/src/mockContext.ts#L22)

Options for [createMockContext](../functions/createMockContext.md).

## Properties

### catalog

> `readonly` **catalog**: `ServiceCatalog`

Defined in: [testing/src/mockContext.ts:24](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/testing/src/mockContext.ts#L24)

The catalog the handler-under-test calls into.

***

### mocks

> `readonly` **mocks**: readonly [`MockService`](MockService.md)[]

Defined in: [testing/src/mockContext.ts:26](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/testing/src/mockContext.ts#L26)

Mock implementations served via the catalog's resolver path.

***

### outgoingInterceptors?

> `readonly` `optional` **outgoingInterceptors?**: readonly `Interceptor`[]

Defined in: [testing/src/mockContext.ts:28](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/testing/src/mockContext.ts#L28)

Optional outgoing interceptors (applied exactly as in production).

***

### propagateHeaders?

> `readonly` `optional` **propagateHeaders?**: readonly `string`[]

Defined in: [testing/src/mockContext.ts:34](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/testing/src/mockContext.ts#L34)

Optional header names propagated onto outgoing calls (default none).

***

### requestHeader?

> `readonly` `optional` **requestHeader?**: `HeadersInit`

Defined in: [testing/src/mockContext.ts:30](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/testing/src/mockContext.ts#L30)

Optional inbound headers (seen by `ctx.requestHeader` + header propagation).

***

### timeoutMs?

> `readonly` `optional` **timeoutMs?**: `number`

Defined in: [testing/src/mockContext.ts:32](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/testing/src/mockContext.ts#L32)

Optional inbound deadline in ms (drives the `ctx.timeoutMs()` cascade).
