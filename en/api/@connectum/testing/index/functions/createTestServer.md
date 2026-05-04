[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createTestServer

# Function: createTestServer()

> **createTestServer**(`options`): `Promise`\<[`TestServer`](../../types/interfaces/TestServer.md)\>

Defined in: [test-server.ts:33](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/testing/src/test-server.ts#L33)

Create and start a test server on a random (or specified) port.

Returns a [TestServer](../../types/interfaces/TestServer.md) with a pre-configured gRPC transport
ready for use with ConnectRPC clients. The caller is responsible
for calling [TestServer.close](../../types/interfaces/TestServer.md#close) when done.

## Parameters

### options

[`CreateTestServerOptions`](../../types/interfaces/CreateTestServerOptions.md)

Server configuration (services, interceptors, protocols, port)

## Returns

`Promise`\<[`TestServer`](../../types/interfaces/TestServer.md)\>

Running test server with transport and cleanup function

## Example

```typescript
const server = await createTestServer({ services: [myRoutes] });
const client = createClient(MyService, server.transport);
const response = await client.myMethod({ id: "1" });
await server.close();
```
