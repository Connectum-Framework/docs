[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / DlqOptions

# Interface: DlqOptions

Defined in: [packages/events/src/types.ts:297](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L297)

Dead letter queue middleware options

## Properties

### errorSerializer?

> `optional` **errorSerializer?**: (`error`) => `string`

Defined in: [packages/events/src/types.ts:306](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L306)

Custom error serializer for DLQ metadata.
Defaults to `error.name` only (e.g. "TypeError") to prevent credential leaks.
For production, provide a custom serializer that redacts sensitive data
(connection strings, tokens) before including error details.

#### Parameters

##### error

`unknown`

#### Returns

`string`

***

### topic

> **topic**: `string`

Defined in: [packages/events/src/types.ts:299](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L299)

DLQ topic name
