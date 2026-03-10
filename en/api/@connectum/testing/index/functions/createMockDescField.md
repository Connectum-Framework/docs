[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createMockDescField

# Function: createMockDescField()

> **createMockDescField**(`localName`, `options?`): `DescField`

Defined in: [mock-desc.ts:62](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/testing/src/mock-desc.ts#L62)

Create a mock DescField descriptor.

Produces a minimal object that satisfies the `DescField` shape expected by
ConnectRPC interceptors and protobuf utilities.

## Parameters

### localName

`string`

The field's local (camelCase) name.

### options?

[`MockDescFieldOptions`](../../types/interfaces/MockDescFieldOptions.md)

Optional overrides for field number, scalar type, and sensitivity.

## Returns

`DescField`

A mock `DescField` object.

## Example

```ts
import { createMockDescField } from "@connectum/testing";

const field = createMockDescField("userId", { type: "int32", fieldNumber: 1 });
// field.localName === "userId"
// field.scalar    === 5  (INT32)
```
