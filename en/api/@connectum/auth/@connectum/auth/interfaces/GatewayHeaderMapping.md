[Connectum API Reference](../../../../../index.md) / [@connectum/auth](../../../index.md) / [@connectum/auth](../index.md) / GatewayHeaderMapping

# Interface: GatewayHeaderMapping

Defined in: [packages/auth/src/types.ts:280](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L280)

Header name mapping for gateway auth context extraction.

Maps AuthContext fields to custom header names used by the API gateway.

## Properties

### claims?

> `readonly` `optional` **claims**: `string`

Defined in: [packages/auth/src/types.ts:292](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L292)

Header containing JSON-encoded claims

***

### name?

> `readonly` `optional` **name**: `string`

Defined in: [packages/auth/src/types.ts:284](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L284)

Header containing the display name

***

### roles?

> `readonly` `optional` **roles**: `string`

Defined in: [packages/auth/src/types.ts:286](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L286)

Header containing JSON-encoded roles array

***

### scopes?

> `readonly` `optional` **scopes**: `string`

Defined in: [packages/auth/src/types.ts:288](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L288)

Header containing space-separated scopes

***

### subject

> `readonly` **subject**: `string`

Defined in: [packages/auth/src/types.ts:282](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L282)

Header containing the authenticated subject

***

### type?

> `readonly` `optional` **type**: `string`

Defined in: [packages/auth/src/types.ts:290](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L290)

Header containing credential type
