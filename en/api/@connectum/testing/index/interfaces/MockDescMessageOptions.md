[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / MockDescMessageOptions

# Interface: MockDescMessageOptions

Defined in: test-fixtures/dist/types.d.ts:37

Options for [createMockDescMessage](../functions/createMockDescMessage.md).

## Properties

### fields?

> `optional` **fields?**: `object`[]

Defined in: test-fixtures/dist/types.d.ts:47

Field definitions. Default: `[]`

`name` is the field name as written in the `.proto` file; `localName` is
derived from it (`user_id` gives `userId`). `fieldNumber` defaults to the
highest number used so far plus one; a repeated number throws, and so does a
number outside 1 to 536870911 or inside the reserved range 19000 to 19999.
`type` is a [MockScalarType](../type-aliases/MockScalarType.md); any other value throws.

#### fieldNumber?

> `optional` **fieldNumber?**: `number`

#### isSensitive?

> `optional` **isSensitive?**: `boolean`

Mark the field as sensitive, as in [MockDescFieldOptions.isSensitive](MockDescFieldOptions.md#issensitive). Default: `false`

#### name

> **name**: `string`

#### type?

> `optional` **type?**: [`MockScalarType`](../type-aliases/MockScalarType.md)

***

### oneofs?

> `optional` **oneofs?**: `string`[]

Defined in: test-fixtures/dist/types.d.ts:55

Oneof group names. A mock oneof group has no fields. Default: `[]`
