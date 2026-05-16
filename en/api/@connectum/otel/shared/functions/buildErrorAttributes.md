[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / buildErrorAttributes

# Function: buildErrorAttributes()

> **buildErrorAttributes**(`error`): `Record`\<`string`, `string` \| `number`\>

Defined in: [packages/otel/src/shared.ts:131](https://github.com/Connectum-Framework/connectum/blob/9c808efa603eaacdf10ddef6780ea699f46a1f35/packages/otel/src/shared.ts#L131)

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
