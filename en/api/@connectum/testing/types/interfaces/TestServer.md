[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [types](../index.md) / TestServer

# Interface: TestServer

Defined in: [types.ts:114](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/testing/src/types.ts#L114)

A running test server with transport and cleanup.

## Properties

### baseUrl

> **baseUrl**: `string`

Defined in: [types.ts:118](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/testing/src/types.ts#L118)

Server base URL (e.g. `http://localhost:54321`).

***

### port

> **port**: `number`

Defined in: [types.ts:120](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/testing/src/types.ts#L120)

Assigned port number.

***

### transport

> **transport**: `Transport`

Defined in: [types.ts:116](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/testing/src/types.ts#L116)

Pre-configured client transport connected to the test server.

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [types.ts:122](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/testing/src/types.ts#L122)

Stop the server and close all connections.

#### Returns

`Promise`\<`void`\>
