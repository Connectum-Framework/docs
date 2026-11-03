[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createFakeMethod

# Function: createFakeMethod()

> **createFakeMethod**(`service`, `name`, `options?`): [`DescMethod`](https://protobufes.com/reference/reflection/descriptors/#types)

Defined in: test-fixtures/dist/index.d.ts:110

Create a fake [DescMethod](https://protobufes.com/reference/reflection/descriptors/#types) descriptor attached to a service.

When `options.register` is `true`, the method is pushed into
`service.methods` and added to `service.method` (keyed by `localName`).
This is required for tests that iterate over service methods
(e.g., `getPublicMethods()`).

## Parameters

### service

[`DescService`](https://protobufes.com/reference/reflection/descriptors/#types)

The parent `DescService` (typically from [createFakeService](createFakeService.md)).

### name

`string`

The RPC method name (PascalCase, e.g. `"GetUser"`).

### options?

[`FakeMethodOptions`](../interfaces/FakeMethodOptions.md)

Optional configuration for method kind and registration.

## Returns

[`DescMethod`](https://protobufes.com/reference/reflection/descriptors/#types)

A fake `DescMethod` suitable for unit/integration tests.

## Throws

TypeError when `options.methodKind` is not `unary`, `server_streaming`,
  `client_streaming` or `bidi_streaming`.

## Throws

Error when `options.register` is `true` and the service already has a method
  with this name (or the same `localName`); the service is left unchanged.

## Example

```ts
import { createFakeService, createFakeMethod } from "@connectum/testing";

const svc = createFakeService();
const method = createFakeMethod(svc, "GetUser", { register: true });
// method.localName === "getUser"
// svc.methods.length === 1
```
