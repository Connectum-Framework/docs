[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createMockDescMethod

# Function: createMockDescMethod()

> **createMockDescMethod**(`name`, `options?`): [`DescMethod`](https://protobufes.com/reference/reflection/descriptors/#types)

Defined in: test-fixtures/dist/index.d.ts:237

Create a mock [DescMethod](https://protobufes.com/reference/reflection/descriptors/#types) descriptor.

When `input` or `output` are not provided, default mock messages are created
automatically based on the method name (e.g. `test.GetUserRequest` /
`test.GetUserResponse`).

## Parameters

### name

`string`

The RPC method name (PascalCase by convention).

### options?

[`MockDescMethodOptions`](../interfaces/MockDescMethodOptions.md)

Optional overrides for kind, input/output, and redaction.

## Returns

[`DescMethod`](https://protobufes.com/reference/reflection/descriptors/#types)

A mock `DescMethod` object.

## Example

```ts
import { createMockDescMethod, createMockDescMessage } from "@connectum/testing";

const method = createMockDescMethod("GetUser");
// method.name       === "GetUser"
// method.localName  === "getUser"
// method.methodKind === "unary"

const streaming = createMockDescMethod("ListUsers", {
  kind: "server_streaming",
});
```
