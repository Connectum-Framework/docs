[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / matchServicesPattern

# Function: matchServicesPattern()

> **matchServicesPattern**(`pattern`, `names`): `string`[]

Defined in: [packages/core/src/enabledServices.ts:42](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/enabledServices.ts#L42)

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
