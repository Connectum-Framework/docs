[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / MockDescMessageOptions

# Interface: MockDescMessageOptions

Defined in: test-fixtures/dist/types.d.ts:32

Options for [createMockDescMessage](../functions/createMockDescMessage.md).

## Properties

### fields?

> `optional` **fields?**: `object`[]

Defined in: test-fixtures/dist/types.d.ts:40

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

Defined in: test-fixtures/dist/types.d.ts:48

Oneof group names. A mock oneof group has no fields. Default: `[]`
