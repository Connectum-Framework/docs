[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / MockDescFieldOptions

# Interface: MockDescFieldOptions

Defined in: test-fixtures/dist/types.d.ts:51

Options for [createMockDescField](../functions/createMockDescField.md).

## Properties

### fieldNumber?

> `optional` **fieldNumber?**: `number`

Defined in: test-fixtures/dist/types.d.ts:59

Proto field number. Default: auto-incremented

***

### isSensitive?

> `optional` **isSensitive?**: `boolean`

Defined in: test-fixtures/dist/types.d.ts:57

Mark the field as sensitive: `proto.options` becomes a `google.protobuf.FieldOptions`
message with `debugRedact` set to `true`, as in a compiled descriptor.
Default: `false`

***

### type?

> `optional` **type?**: `string`

Defined in: test-fixtures/dist/types.d.ts:61

Field scalar type. Default: `'string'`
