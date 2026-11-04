[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createTestServer

# Function: createTestServer()

> **createTestServer**(`options`): `Promise`\<[`TestServer`](../../types/interfaces/TestServer.md)\>

Defined in: [testing/src/test-server.ts:53](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/test-server.ts#L53)

Create and start a test server on a random (or specified) port.

Returns a [TestServer](../../types/interfaces/TestServer.md) with a pre-configured gRPC transport
ready for use with ConnectRPC clients. The caller is responsible
for calling [TestServer.close](../../types/interfaces/TestServer.md#close) when done.

The server listens on `127.0.0.1` unless `options.host` says otherwise.
[TestServer.close](../../types/interfaces/TestServer.md#close) waits up to `options.shutdown.timeout` (30 s by
default) for calls that have not finished.

## Parameters

### options

[`CreateTestServerOptions`](../../types/interfaces/CreateTestServerOptions.md)

Server configuration (services, interceptors, protocols, port, host, shutdown)

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
