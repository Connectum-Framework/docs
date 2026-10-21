[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / buildErrorAttributes

# Function: buildErrorAttributes()

> **buildErrorAttributes**(`error`): `Record`\<`string`, `string`\>

Defined in: [shared.ts:183](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/shared.ts#L183)

Builds error-specific attributes for spans and metrics.

For ConnectError instances, `error.type` and `rpc.response.status_code` both carry the
Connect error-code name (the convention asks `error.type` to be the status code).
For generic Error instances, records the error constructor name as `error.type` only.
For unknown error types, records "UNKNOWN".

## Parameters

### error

`unknown`

The caught error

## Returns

`Record`\<`string`, `string`\>

Record of error attributes to attach to spans/metrics
