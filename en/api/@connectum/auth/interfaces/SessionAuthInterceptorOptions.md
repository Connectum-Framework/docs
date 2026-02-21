[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / SessionAuthInterceptorOptions

# Interface: SessionAuthInterceptorOptions

Defined in: [packages/auth/src/types.ts:326](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L326)

Session-based auth interceptor options.

Two-step authentication: verify session token, then map session data to AuthContext.

## Properties

### cache?

> `readonly` `optional` **cache**: [`CacheOptions`](CacheOptions.md)

Defined in: [packages/auth/src/types.ts:349](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L349)

LRU cache for session verification results

***

### extractToken()?

> `readonly` `optional` **extractToken**: (`req`) => `string` \| `Promise`\<`string` \| `null`\> \| `null`

Defined in: [packages/auth/src/types.ts:347](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L347)

Custom token extraction.
Default: extracts Bearer token from Authorization header.

#### Parameters

##### req

###### header

`Headers`

#### Returns

`string` \| `Promise`\<`string` \| `null`\> \| `null`

***

### mapSession()

> `readonly` **mapSession**: (`session`) => [`AuthContext`](AuthContext.md) \| `Promise`\<[`AuthContext`](AuthContext.md)\>

Defined in: [packages/auth/src/types.ts:342](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L342)

Map raw session data to AuthContext.

#### Parameters

##### session

`unknown`

Raw session data from verifySession

#### Returns

[`AuthContext`](AuthContext.md) \| `Promise`\<[`AuthContext`](AuthContext.md)\>

Normalized auth context

***

### propagatedClaims?

> `readonly` `optional` **propagatedClaims**: `string`[]

Defined in: [packages/auth/src/types.ts:359](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L359)

Filter which claims are propagated in headers.
When set, only listed claim keys are included in x-auth-claims header.
When not set, all claims are propagated.

***

### propagateHeaders?

> `readonly` `optional` **propagateHeaders**: `boolean`

Defined in: [packages/auth/src/types.ts:353](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L353)

Propagate auth context as headers for downstream services

***

### skipMethods?

> `readonly` `optional` **skipMethods**: `string`[]

Defined in: [packages/auth/src/types.ts:351](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L351)

Methods to skip authentication for

***

### verifySession()

> `readonly` **verifySession**: (`token`, `headers`) => `unknown`

Defined in: [packages/auth/src/types.ts:335](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L335)

Verify session token and return raw session data.
Must throw on invalid/expired sessions.

#### Parameters

##### token

`string`

Session token string

##### headers

`Headers`

Request headers (for additional context)

#### Returns

`unknown`

Raw session data
