[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / MockDescFieldOptions

# Interface: MockDescFieldOptions

Defined in: test-fixtures/dist/types.d.ts:58

Options for [createMockDescField](../functions/createMockDescField.md).

## Properties

### fieldNumber?

> `optional` **fieldNumber?**: `number`

Defined in: test-fixtures/dist/types.d.ts:70

Proto field number, an integer from 1 to 536870911 outside the reserved range
19000 to 19999; any other value throws. Default: `1` (auto-incremented in
[createMockDescMessage](../functions/createMockDescMessage.md))

***

### isSensitive?

> `optional` **isSensitive?**: `boolean`

Defined in: test-fixtures/dist/types.d.ts:64

Mark the field as sensitive: `proto.options` becomes a `google.protobuf.FieldOptions`
message with `debugRedact` set to `true`, as in a compiled descriptor.
Default: `false`

***

### type?

> `optional` **type?**: [`MockScalarType`](../type-aliases/MockScalarType.md)

Defined in: test-fixtures/dist/types.d.ts:72

Field scalar type; a name that is not a [MockScalarType](../type-aliases/MockScalarType.md) throws. Default: `'string'`
