[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createMockDescField

# Function: createMockDescField()

> **createMockDescField**(`localName`, `options?`): [`DescField`](https://protobufes.com/reference/reflection/descriptors/#field-descriptors)

Defined in: test-fixtures/dist/index.d.ts:183

Create a mock [DescField](https://protobufes.com/reference/reflection/descriptors/#field-descriptors) descriptor.

Produces a minimal object that satisfies the `DescField` shape expected by
ConnectRPC interceptors and protobuf utilities.

## Parameters

### localName

`string`

The field's local (camelCase) name.

### options?

[`MockDescFieldOptions`](../interfaces/MockDescFieldOptions.md)

Optional overrides for field number, scalar type, and sensitivity.

## Returns

[`DescField`](https://protobufes.com/reference/reflection/descriptors/#field-descriptors)

A mock `DescField` object.

## Example

```ts
import { createMockDescField } from "@connectum/testing";

const field = createMockDescField("userId", { type: "int32", fieldNumber: 1 });
// field.localName === "userId"
// field.scalar    === 5  (INT32)
```
