[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [types](../index.md) / MockDescFieldOptions

# Interface: MockDescFieldOptions

Defined in: [types.ts:70](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L70)

Options for [createMockDescField](../../index/functions/createMockDescField.md).

## Properties

### fieldNumber?

> `optional` **fieldNumber?**: `number`

Defined in: [types.ts:78](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L78)

Proto field number. Default: auto-incremented

***

### isSensitive?

> `optional` **isSensitive?**: `boolean`

Defined in: [types.ts:76](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L76)

Mark the field as sensitive: `proto.options` becomes a `google.protobuf.FieldOptions`
message with `debugRedact` set to `true`, as in a compiled descriptor.
Default: `false`

***

### type?

> `optional` **type?**: `string`

Defined in: [types.ts:80](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L80)

Field scalar type. Default: `'string'`
