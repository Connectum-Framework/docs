[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / matchServicesPattern

# Function: matchServicesPattern()

> **matchServicesPattern**(`pattern`, `names`): `string`[]

Defined in: [packages/core/src/enabledServices.ts:31](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/enabledServices.ts#L31)

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
