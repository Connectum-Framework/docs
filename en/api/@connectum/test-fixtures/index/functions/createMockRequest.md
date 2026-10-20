[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [index](../index.md) / createMockRequest

# Function: createMockRequest()

> **createMockRequest**(`options?`): `any`

Defined in: [mock-request.ts:39](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/mock-request.ts#L39)

Create a simplified ConnectRPC request fixture for interceptor unit tests.

Provides common request fields and an independent, non-aborted signal.
Service and method descriptors are minimal mocks. Tests that need
requestMethod, contextValues or complete protobuf descriptors must supply
those fields separately, or exercise an actual RPC transport.

The generated `url` is a placeholder: its origin is `http://localhost`, while
a request produced by the in-process transport carries `https://in-memory/…`.
Only the path (`/<service typeName>/<method name>`) mirrors a real request.
Pass `url` explicitly when the code under test depends on the origin.

## Parameters

### options?

[`MockRequestOptions`](../../types/interfaces/MockRequestOptions.md)

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
