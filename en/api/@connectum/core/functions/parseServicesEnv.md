[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / parseServicesEnv

# Function: parseServicesEnv()

> **parseServicesEnv**(`value`): `string`[]

Defined in: [packages/core/src/enabledServices.ts:18](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/enabledServices.ts#L18)

Parse a comma-separated env value into a list of proto `typeName`s, trimming
whitespace and dropping empty entries. Returns `[]` for an empty/undefined value.

## Parameters

### value

`string` \| `null` \| `undefined`

## Returns

`string`[]

## Example

```ts
`enabledServices: parseServicesEnv(process.env.CONNECTUM_SERVICES)`
```
