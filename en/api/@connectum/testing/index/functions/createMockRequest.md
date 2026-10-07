[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createMockRequest

# Function: createMockRequest()

> **createMockRequest**(`options?`): `any`

Defined in: test-fixtures/dist/index.d.ts:340

Create a simplified ConnectRPC request fixture for interceptor unit tests.

Provides common request fields and an independent, non-aborted signal.
Service and method descriptors are minimal mocks. Tests that need
requestMethod, contextValues or complete protobuf descriptors must supply
those fields separately, or exercise an actual RPC transport.

## Parameters

### options?

[`MockRequestOptions`](../interfaces/MockRequestOptions.md)

Optional overrides for request fields.

## Returns

`any`

A plain object containing simplified request fields.

## Example

```ts
import { createMockRequest } from "@connectum/testing";

const req = createMockRequest({ service: "acme.UserService", method: "GetUser" });
// req.service.typeName === "acme.UserService"
// req.method.name     === "GetUser"
// req.url             === "http://localhost/acme.UserService/GetUser"
```
