[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [types](../index.md) / MockDescMessageOptions

# Interface: MockDescMessageOptions

Defined in: [types.ts:71](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L71)

Options for [createMockDescMessage](../../index/functions/createMockDescMessage.md).

## Properties

### fields?

> `optional` **fields?**: `object`[]

Defined in: [types.ts:81](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L81)

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

Defined in: [types.ts:89](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L89)

Oneof group names. A mock oneof group has no fields. Default: `[]`
