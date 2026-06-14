[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [types](../index.md) / MockDescFieldOptions

# Interface: MockDescFieldOptions

Defined in: [types.ts:58](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/test-fixtures/src/types.ts#L58)

Options for createMockDescField.

## Properties

### fieldNumber?

> `optional` **fieldNumber?**: `number`

Defined in: [types.ts:62](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/test-fixtures/src/types.ts#L62)

Proto field number. Default: auto-incremented

***

### isSensitive?

> `optional` **isSensitive?**: `boolean`

Defined in: [types.ts:60](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/test-fixtures/src/types.ts#L60)

Mark field as sensitive (for redact interceptor). Default: `false`

***

### type?

> `optional` **type?**: `string`

Defined in: [types.ts:64](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/test-fixtures/src/types.ts#L64)

Field scalar type. Default: `'string'`
