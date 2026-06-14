[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / isSanitizableError

# Function: isSanitizableError()

> **isSanitizableError**(`err`): `err is Error & SanitizableError & { code: number }`

Defined in: [packages/core/src/errors.ts:28](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/errors.ts#L28)

Type guard for SanitizableError.

Checks if the value is an object with clientMessage (string) and
serverDetails (non-null object) properties, plus a numeric code.

## Parameters

### err

`unknown`

## Returns

`err is Error & SanitizableError & { code: number }`
