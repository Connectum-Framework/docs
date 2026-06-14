[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / matchServicesPattern

# Function: matchServicesPattern()

> **matchServicesPattern**(`pattern`, `names`): `string`[]

Defined in: [packages/core/src/enabledServices.ts:31](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/enabledServices.ts#L31)

Return the subset of `names` matching a glob `pattern`, where `*` matches any
run of characters (including dots). E.g. `"acme.*"` matches
`"acme.v1.UsersService"`. Matched without a constructed `RegExp` (segment scan).

## Parameters

### pattern

`string`

### names

readonly `string`[]

## Returns

`string`[]
