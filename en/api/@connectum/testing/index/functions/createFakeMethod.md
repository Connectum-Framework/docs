[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createFakeMethod

# Function: createFakeMethod()

> **createFakeMethod**(`service`, `name`, `options?`): `DescMethod`

Defined in: [fake-service.ts:72](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/testing/src/fake-service.ts#L72)

Create a fake DescMethod descriptor attached to a service.

When `options.register` is `true`, the method is pushed into
`service.methods` and added to `service.method` (keyed by `localName`).
This is required for tests that iterate over service methods
(e.g., `getPublicMethods()`).

## Parameters

### service

`DescService`

The parent `DescService` (typically from [createFakeService](createFakeService.md)).

### name

`string`

The RPC method name (PascalCase, e.g. `"GetUser"`).

### options?

[`FakeMethodOptions`](../../types/interfaces/FakeMethodOptions.md)

Optional configuration for method kind and registration.

## Returns

`DescMethod`

A fake `DescMethod` suitable for unit/integration tests.

## Example

```ts
import { createFakeService, createFakeMethod } from "@connectum/testing";

const svc = createFakeService();
const method = createFakeMethod(svc, "GetUser", { register: true });
// method.localName === "getUser"
// svc.methods.length === 1
```
