[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / buildErrorAttributes

# Function: buildErrorAttributes()

> **buildErrorAttributes**(`error`): `Record`\<`string`, `string` \| `number`\>

Defined in: [packages/otel/src/shared.ts:131](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/otel/src/shared.ts#L131)

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
