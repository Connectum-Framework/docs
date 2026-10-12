[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / isSanitizableError

# Function: isSanitizableError()

> **isSanitizableError**(`err`): `err is Error & SanitizableError & { code: number }`

Defined in: [packages/core/src/errors.ts:29](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/errors.ts#L29)

Type guard for SanitizableError.

Requires an Error instance with clientMessage (string), serverDetails
(non-null object), and code (number). A plain object with these fields
does not satisfy the guard.

## Parameters

### err

`unknown`

## Returns

`err is Error & SanitizableError & { code: number }`
