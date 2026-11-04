[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / isServerErrorStatus

# Function: isServerErrorStatus()

> **isServerErrorStatus**(`error`): `boolean`

Defined in: [shared.ts:274](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/shared.ts#L274)

Whether an error that ended a call counts as an error of its server span. An error that
is not a `ConnectError` is turned into `unknown` by the server and counts.

## Parameters

### error

`unknown`

The error, exactly as caught

## Returns

`boolean`
