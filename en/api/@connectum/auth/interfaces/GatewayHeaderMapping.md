[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / GatewayHeaderMapping

# Interface: GatewayHeaderMapping

Defined in: [packages/auth/src/types.ts:380](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L380)

Header name mapping for gateway auth context extraction.

Maps AuthContext fields to custom header names used by the API gateway.

## Properties

### claims?

> `readonly` `optional` **claims?**: `string`

Defined in: [packages/auth/src/types.ts:396](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L396)

Header containing JSON-encoded claims

***

### name?

> `readonly` `optional` **name?**: `string`

Defined in: [packages/auth/src/types.ts:384](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L384)

Header containing the display name

***

### roles?

> `readonly` `optional` **roles?**: `string`

Defined in: [packages/auth/src/types.ts:390](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L390)

Header containing the roles: a JSON array of strings (`["admin","editor"]`) or a
comma-separated list (`admin, editor`). Any value that is not a JSON array, including
JSON of another kind such as `123` or `true`, is read as a comma-separated list.

***

### scopes?

> `readonly` `optional` **scopes?**: `string`

Defined in: [packages/auth/src/types.ts:392](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L392)

Header containing space-separated scopes

***

### subject

> `readonly` **subject**: `string`

Defined in: [packages/auth/src/types.ts:382](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L382)

Header containing the authenticated subject

***

### type?

> `readonly` `optional` **type?**: `string`

Defined in: [packages/auth/src/types.ts:394](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L394)

Header containing credential type
