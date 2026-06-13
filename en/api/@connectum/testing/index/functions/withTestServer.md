[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / withTestServer

# Function: withTestServer()

> **withTestServer**\<`T`\>(`options`, `testFn`): `Promise`\<`T`\>

Defined in: [testing/src/test-server.ts:93](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/testing/src/test-server.ts#L93)

Run a test function with an auto-managed test server.

Creates a test server, passes it to [testFn](#withtestserver), and guarantees
cleanup via `finally` — even if the test throws.

## Type Parameters

### T

`T`

## Parameters

### options

[`CreateTestServerOptions`](../../types/interfaces/CreateTestServerOptions.md)

Server configuration (services, interceptors, protocols, port)

### testFn

(`server`) => `Promise`\<`T`\>

Async function that receives the running test server

## Returns

`Promise`\<`T`\>

The value returned by testFn

## Example

```typescript
const result = await withTestServer({ services: [myRoutes] }, async (server) => {
  const client = createClient(MyService, server.transport);
  return client.myMethod({ id: "1" });
});
```
