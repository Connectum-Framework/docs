[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / buildErrorAttributes

# Function: buildErrorAttributes()

> **buildErrorAttributes**(`error`): `Record`\<`string`, `string` \| `number`\>

Defined in: [packages/otel/src/shared.ts:129](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/shared.ts#L129)

Builds error-specific attributes for spans and metrics.

For ConnectError instances, records the Connect error code name and numeric code.
For generic Error instances, records the error constructor name.
For unknown error types, records "UNKNOWN".

## Parameters

### error

`unknown`

The caught error

## Returns

`Record`\<`string`, `string` \| `number`\>

Record of error attributes to attach to spans/metrics
