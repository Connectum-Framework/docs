[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / DlqOptions

# Interface: DlqOptions

Defined in: [packages/events/src/types.ts:252](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L252)

Dead letter queue middleware options

## Properties

### errorSerializer()?

> `optional` **errorSerializer**: (`error`) => `string`

Defined in: [packages/events/src/types.ts:261](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L261)

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

Defined in: [packages/events/src/types.ts:254](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L254)

DLQ topic name
