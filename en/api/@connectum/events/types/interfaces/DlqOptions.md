[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / DlqOptions

# Interface: DlqOptions

Defined in: [packages/events/src/types.ts:344](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L344)

Dead letter queue middleware options

## Properties

### errorSerializer?

> `optional` **errorSerializer?**: (`error`) => `string`

Defined in: [packages/events/src/types.ts:358](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L358)

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

Defined in: [packages/events/src/types.ts:351](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L351)

DLQ topic name: a non-empty string. Anything else (a missing or empty value, a non-string)
makes `createEventBus` and `dlqMiddleware` throw when they are created, because every failed
event would otherwise be lost. Whether the broker accepts the name is decided by the adapter
at the first publish; a rejected publish is reported as a `dlq-failed` observer event.
