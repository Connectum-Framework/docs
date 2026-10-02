[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [types](../index.md) / MockDescFieldOptions

# Interface: MockDescFieldOptions

Defined in: [types.ts:62](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L62)

Options for [createMockDescField](../../index/functions/createMockDescField.md).

## Properties

### fieldNumber?

> `optional` **fieldNumber?**: `number`

Defined in: [types.ts:66](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L66)

Proto field number. Default: auto-incremented

***

### isSensitive?

> `optional` **isSensitive?**: `boolean`

Defined in: [types.ts:64](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L64)

Mark field as sensitive (for redact interceptor). Default: `false`

***

### type?

> `optional` **type?**: `string`

Defined in: [types.ts:68](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L68)

Field scalar type. Default: `'string'`
