[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createFakeService

# Function: createFakeService()

> **createFakeService**(`options?`): `DescService`

Defined in: [fake-service.ts:34](https://github.com/Connectum-Framework/connectum/blob/fd380003ee89443a5c37d7e75042a06399e158b4/packages/testing/src/fake-service.ts#L34)

Create a fake DescService descriptor for testing.

The returned object has the same shape as a real `DescService` produced by
the protobuf compiler, but contains only the fields commonly accessed in
interceptor and utility code. The `methods` array and `method` lookup map
start empty; use [createFakeMethod](createFakeMethod.md) with `register: true` to populate them.

## Parameters

### options?

[`FakeServiceOptions`](../../types/interfaces/FakeServiceOptions.md)

Optional overrides for service name and typeName.

## Returns

`DescService`

A fake `DescService` suitable for unit/integration tests.

## Example

```ts
import { createFakeService } from "@connectum/testing";

const svc = createFakeService({ typeName: "acme.v1.UserService" });
// svc.typeName === "acme.v1.UserService"
// svc.name     === "UserService"
```
