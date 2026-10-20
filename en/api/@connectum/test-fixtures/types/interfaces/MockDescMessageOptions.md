[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [types](../index.md) / MockDescMessageOptions

# Interface: MockDescMessageOptions

Defined in: [types.ts:50](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L50)

Options for [createMockDescMessage](../../index/functions/createMockDescMessage.md).

## Properties

### fields?

> `optional` **fields?**: `object`[]

Defined in: [types.ts:58](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L58)

Field definitions. Default: `[]`

`name` is the field name as written in the `.proto` file; `localName` is
derived from it (`user_id` gives `userId`). `fieldNumber` defaults to the
highest number used so far plus one; a repeated number throws.

#### fieldNumber?

> `optional` **fieldNumber?**: `number`

#### isSensitive?

> `optional` **isSensitive?**: `boolean`

Mark the field as sensitive, as in [MockDescFieldOptions.isSensitive](MockDescFieldOptions.md#issensitive). Default: `false`

#### name

> **name**: `string`

#### type?

> `optional` **type?**: `string`

***

### oneofs?

> `optional` **oneofs?**: `string`[]

Defined in: [types.ts:66](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L66)

Oneof group names. A mock oneof group has no fields. Default: `[]`
