[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / withTestServer

# Function: withTestServer()

> **withTestServer**\<`T`\>(`options`, `testFn`): `Promise`\<`T`\>

Defined in: [test-server.ts:93](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/testing/src/test-server.ts#L93)

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
