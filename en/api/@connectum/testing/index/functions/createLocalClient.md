[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createLocalClient

# Function: createLocalClient()

> **createLocalClient**\<`T`\>(`server`, `service`): `Client`\<`T`\>

Defined in: [testing/src/createLocalClient.ts:38](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/createLocalClient.ts#L38)

Create an in-process ConnectRPC client for a service registered on the given Server.

## Type Parameters

### T

`T` *extends* `DescService`

## Parameters

### server

`Server`

A server created via `createServer({...})`. Does not need to be started.

### service

`T`

The proto service descriptor (e.g. `GreeterService`).

## Returns

`Client`\<`T`\>

A typed ConnectRPC `Client<T>` that invokes handlers via the in-memory pipe.

## Example

```typescript
import { createServer } from "@connectum/core";
import { createLocalClient } from "@connectum/testing";

const server = createServer({ services: [greeterRoutes] });
const client = createLocalClient(server, GreeterService);
const res = await client.sayHello({ name: "world" });
```
