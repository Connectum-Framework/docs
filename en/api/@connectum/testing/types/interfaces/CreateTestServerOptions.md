[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [types](../index.md) / CreateTestServerOptions

# Interface: CreateTestServerOptions

Defined in: [types.ts:126](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/testing/src/types.ts#L126)

Options for createTestServer.

## Properties

### interceptors?

> `optional` **interceptors**: `unknown`[]

Defined in: [types.ts:130](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/testing/src/types.ts#L130)

Interceptors to apply. Default: `[]`

***

### port?

> `optional` **port**: `number`

Defined in: [types.ts:134](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/testing/src/types.ts#L134)

Port number. Default: `0` (random available port)

***

### protocols?

> `optional` **protocols**: `unknown`[]

Defined in: [types.ts:132](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/testing/src/types.ts#L132)

Protocol extensions (Healthcheck, Reflection). Default: `[]`

***

### services

> **services**: `unknown`[]

Defined in: [types.ts:128](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/testing/src/types.ts#L128)

ConnectRPC service route handlers.
