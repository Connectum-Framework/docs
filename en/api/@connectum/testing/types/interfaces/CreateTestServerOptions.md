[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [types](../index.md) / CreateTestServerOptions

# Interface: CreateTestServerOptions

Defined in: [testing/src/types.ts:38](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/testing/src/types.ts#L38)

Options for createTestServer.

## Properties

### interceptors?

> `optional` **interceptors?**: `unknown`[]

Defined in: [testing/src/types.ts:42](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/testing/src/types.ts#L42)

Interceptors to apply. Default: `[]`

***

### port?

> `optional` **port?**: `number`

Defined in: [testing/src/types.ts:46](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/testing/src/types.ts#L46)

Port number. Default: `0` (random available port)

***

### protocols?

> `optional` **protocols?**: `unknown`[]

Defined in: [testing/src/types.ts:44](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/testing/src/types.ts#L44)

Protocol extensions (Healthcheck, Reflection). Default: `[]`

***

### services

> **services**: `unknown`[]

Defined in: [testing/src/types.ts:40](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/testing/src/types.ts#L40)

ConnectRPC service route handlers.
