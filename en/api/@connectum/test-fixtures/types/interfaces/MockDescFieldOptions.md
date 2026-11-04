[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [types](../index.md) / MockDescFieldOptions

# Interface: MockDescFieldOptions

Defined in: [types.ts:93](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L93)

Options for [createMockDescField](../../index/functions/createMockDescField.md).

## Properties

### fieldNumber?

> `optional` **fieldNumber?**: `number`

Defined in: [types.ts:105](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L105)

Proto field number, an integer from 1 to 536870911 outside the reserved range
19000 to 19999; any other value throws. Default: `1` (auto-incremented in
[createMockDescMessage](../../index/functions/createMockDescMessage.md))

***

### isSensitive?

> `optional` **isSensitive?**: `boolean`

Defined in: [types.ts:99](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L99)

Mark the field as sensitive: `proto.options` becomes a `google.protobuf.FieldOptions`
message with `debugRedact` set to `true`, as in a compiled descriptor.
Default: `false`

***

### type?

> `optional` **type?**: [`MockScalarType`](../type-aliases/MockScalarType.md)

Defined in: [types.ts:107](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L107)

Field scalar type; a name that is not a [MockScalarType](../type-aliases/MockScalarType.md) throws. Default: `'string'`
