[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [index](../index.md) / createMockDescMessage

# Function: createMockDescMessage()

> **createMockDescMessage**(`typeName`, `options?`): [`DescMessage`](https://protobufes.com/reference/reflection/descriptors/#types)

Defined in: [mock-desc.ts:177](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/mock-desc.ts#L177)

Create a mock [DescMessage](https://protobufes.com/reference/reflection/descriptors/#types) descriptor with all required structural
properties.

`members` lists the standalone fields in declaration order followed by the
oneof groups, so `create()` from `@bufbuild/protobuf` fills every declared
field with its zero value and every oneof group with `{ case: undefined }`,
as it does for a compiled descriptor.

Field numbers that are not given explicitly continue from the highest number
used so far (`max + 1`). Two fields with the same number make the factory
throw, as `protoc` rejects such a message.

Like a compiled descriptor, every field points back at the message through
`parent`, the message itself has `parent` `undefined` (a top-level message), and
its `file` reports the proto3 edition (`edition` is `Edition.EDITION_PROTO3`;
`proto.syntax` is `"proto3"` and `proto.edition` is `Edition.EDITION_UNKNOWN`).
That makes `toBinary`, `isFieldSet`, `equals` and `clone` of `@bufbuild/protobuf`
accept the mock. The parent link is circular, so `JSON.stringify` of a mock
message that has fields throws a `TypeError`, as it does for a compiled
descriptor: serialise `typeName` and the field names instead of the descriptor.

Limitations: a mock oneof group has no fields (`fields: []`) and the declared
fields are not attached to it, and a custom `json_name` option cannot be
expressed.

## Parameters

### typeName

`string`

Fully-qualified protobuf type name (e.g. `"acme.v1.User"`).

### options?

[`MockDescMessageOptions`](../../types/interfaces/MockDescMessageOptions.md)

Optional field and oneof definitions. A field `name` is the
  proto name (see [createMockDescField](createMockDescField.md)).

## Returns

[`DescMessage`](https://protobufes.com/reference/reflection/descriptors/#types)

A mock `DescMessage` object.

## Throws

Error when two fields share the same field number.

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
