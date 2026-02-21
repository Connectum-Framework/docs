[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / matchesMethodPattern

# Function: matchesMethodPattern()

> **matchesMethodPattern**(`serviceName`, `methodName`, `patterns`): `boolean`

Defined in: [packages/auth/src/method-match.ts:23](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/auth/src/method-match.ts#L23)

Check if a method matches any of the given patterns.

Patterns:
- "*" — matches all methods
- "Service/*" — matches all methods of a service
- "Service/Method" — matches exact method

## Parameters

### serviceName

`string`

Fully-qualified service name (e.g., "user.v1.UserService")

### methodName

`string`

Method name (e.g., "GetUser")

### patterns

readonly `string`[]

Readonly array of match patterns

## Returns

`boolean`

true if the method matches any pattern
