[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [types](../index.md) / TestServer

# Interface: TestServer

Defined in: [testing/src/types.ts:26](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/testing/src/types.ts#L26)

A running test server with transport and cleanup.

## Properties

### baseUrl

> **baseUrl**: `string`

Defined in: [testing/src/types.ts:30](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/testing/src/types.ts#L30)

Server base URL (e.g. `http://localhost:54321`).

***

### port

> **port**: `number`

Defined in: [testing/src/types.ts:32](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/testing/src/types.ts#L32)

Assigned port number.

***

### transport

> **transport**: `Transport`

Defined in: [testing/src/types.ts:28](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/testing/src/types.ts#L28)

Pre-configured client transport connected to the test server.

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [testing/src/types.ts:34](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/testing/src/types.ts#L34)

Stop the server and close all connections.

#### Returns

`Promise`\<`void`\>
