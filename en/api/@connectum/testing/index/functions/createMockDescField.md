[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createMockDescField

# Function: createMockDescField()

> **createMockDescField**(`name`, `options?`): [`DescField`](https://protobufes.com/reference/reflection/descriptors/#field-descriptors)

Defined in: test-fixtures/dist/index.d.ts:203

Create a mock [DescField](https://protobufes.com/reference/reflection/descriptors/#field-descriptors) descriptor.

Produces a minimal object that satisfies the `DescField` shape expected by
ConnectRPC interceptors and protobuf utilities.

The field is a proto3 singular scalar field with implicit presence: like a
compiled descriptor, `getDefaultValue()` returns `undefined` (so `create()`
fills in the scalar zero value) and `longAsString` is `false`.

With `isSensitive: true`, `proto.options` is a real `google.protobuf.FieldOptions`
message with `debugRedact` set to `true`, as in a compiled descriptor; without it
`proto.options` is `undefined`.

Limit: a field created here alone has `parent` `undefined`. Fields listed by
[createMockDescMessage](createMockDescMessage.md) are linked to their message through `parent`, which
the protobuf-es helpers that read `field.parent` (`toBinary`, `isFieldSet`,
`equals`, `clone`) need; declare the field through that factory when a test passes
the descriptor to them.

## Parameters

### name

`string`

The field's name as written in the `.proto` file (for example
  `user_id`). `localName` and `jsonName` are derived from it by the protobuf-es
  rules: `user_id` gives `userId`, and a name that collides with a built-in
  object property (`constructor`, `toString`, `toJSON`, `valueOf`) gets a `$`
  suffix in `localName`. A name that is already camelCase is kept unchanged.
  A custom `json_name` option cannot be expressed.

### options?

[`MockDescFieldOptions`](../interfaces/MockDescFieldOptions.md)

Optional overrides for field number, scalar type, and sensitivity.

## Returns

[`DescField`](https://protobufes.com/reference/reflection/descriptors/#field-descriptors)

A mock `DescField` object.

## Example

```ts
import { createMockDescField } from "@connectum/testing";

const field = createMockDescField("user_id", { type: "int32", fieldNumber: 1 });
// field.name      === "user_id"
// field.localName === "userId"
// field.scalar    === 5  (INT32)
```
