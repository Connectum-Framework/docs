[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createMockDescMethod

# Function: createMockDescMethod()

> **createMockDescMethod**(`name`, `options?`): `DescMethod`

Defined in: [mock-desc.ts:172](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/testing/src/mock-desc.ts#L172)

Create a mock DescMethod descriptor.

When `input` or `output` are not provided, default mock messages are created
automatically based on the method name (e.g. `test.GetUserRequest` /
`test.GetUserResponse`).

## Parameters

### name

`string`

The RPC method name (PascalCase by convention).

### options?

[`MockDescMethodOptions`](../../types/interfaces/MockDescMethodOptions.md)

Optional overrides for kind, input/output, and redaction.

## Returns

`DescMethod`

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
