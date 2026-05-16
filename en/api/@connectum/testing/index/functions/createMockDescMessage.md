[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createMockDescMessage

# Function: createMockDescMessage()

> **createMockDescMessage**(`typeName`, `options?`): `DescMessage`

Defined in: test-fixtures/dist/index.d.ts:210

Create a mock DescMessage descriptor with all required structural
properties.

**Important**: the returned object always includes `members: []` which is
required by `create()` from `@bufbuild/protobuf` — without it the runtime
crashes.

## Parameters

### typeName

`string`

Fully-qualified protobuf type name (e.g. `"acme.v1.User"`).

### options?

[`MockDescMessageOptions`](../interfaces/MockDescMessageOptions.md)

Optional field and oneof definitions.

## Returns

`DescMessage`

A mock `DescMessage` object.

## Example

```ts
import { createMockDescMessage } from "@connectum/testing";

const msg = createMockDescMessage("acme.v1.User", {
  fields: [
    { name: "id", type: "int32" },
    { name: "email", type: "string" },
  ],
});
// msg.typeName === "acme.v1.User"
// msg.name     === "User"
// msg.fields   === [DescField, DescField]
```
