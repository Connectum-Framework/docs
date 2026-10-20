[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / GatewayHeaderMapping

# Interface: GatewayHeaderMapping

Defined in: [packages/auth/src/types.ts:306](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L306)

Header name mapping for gateway auth context extraction.

Maps AuthContext fields to custom header names used by the API gateway.

## Properties

### claims?

> `readonly` `optional` **claims?**: `string`

Defined in: [packages/auth/src/types.ts:322](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L322)

Header containing JSON-encoded claims

***

### name?

> `readonly` `optional` **name?**: `string`

Defined in: [packages/auth/src/types.ts:310](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L310)

Header containing the display name

***

### roles?

> `readonly` `optional` **roles?**: `string`

Defined in: [packages/auth/src/types.ts:316](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L316)

Header containing the roles: a JSON array of strings (`["admin","editor"]`) or a
comma-separated list (`admin, editor`). Any value that is not a JSON array, including
JSON of another kind such as `123` or `true`, is read as a comma-separated list.

***

### scopes?

> `readonly` `optional` **scopes?**: `string`

Defined in: [packages/auth/src/types.ts:318](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L318)

Header containing space-separated scopes

***

### subject

> `readonly` **subject**: `string`

Defined in: [packages/auth/src/types.ts:308](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L308)

Header containing the authenticated subject

***

### type?

> `readonly` `optional` **type?**: `string`

Defined in: [packages/auth/src/types.ts:320](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L320)

Header containing credential type
