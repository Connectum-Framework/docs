[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / isSanitizableError

# Function: isSanitizableError()

> **isSanitizableError**(`err`): `err is Error & SanitizableError & { code: number }`

Defined in: [packages/core/src/errors.ts:28](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/core/src/errors.ts#L28)

Type guard for SanitizableError.

Checks if the value is an object with clientMessage (string) and
serverDetails (non-null object) properties, plus a numeric code.

## Parameters

### err

`unknown`

## Returns

`err is Error & SanitizableError & { code: number }`
