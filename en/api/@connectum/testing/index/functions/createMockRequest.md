[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createMockRequest

# Function: createMockRequest()

> **createMockRequest**(`options?`): `any`

Defined in: [mock-request.ts:34](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/testing/src/mock-request.ts#L34)

Create a mock ConnectRPC [UnaryRequest](https://connectrpc.com/docs/node/interceptors)
object suitable for testing interceptors.

All fields have sensible defaults, so calling `createMockRequest()` with no
arguments returns a fully valid request that can be passed straight into an
interceptor under test.

## Parameters

### options?

[`MockRequestOptions`](../../types/interfaces/MockRequestOptions.md)

Optional overrides for request fields.

## Returns

`any`

A plain object matching the ConnectRPC `UnaryRequest` shape.

## Example

```ts
import { createMockRequest } from "@connectum/testing";

const req = createMockRequest({ service: "acme.UserService", method: "GetUser" });
// req.service.typeName === "acme.UserService"
// req.method.name     === "GetUser"
// req.url             === "http://localhost/acme.UserService/GetUser"
```
