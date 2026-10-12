[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / SessionAuthInterceptorOptions

# Interface: SessionAuthInterceptorOptions

Defined in: [packages/auth/src/types.ts:497](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L497)

Session-based auth interceptor options.

Two-step authentication: verify session token, then map session data to AuthContext.

## Properties

### cache?

> `readonly` `optional` **cache?**: [`CacheOptions`](CacheOptions.md)

Defined in: [packages/auth/src/types.ts:520](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L520)

LRU cache for session verification results

***

### extractToken?

> `readonly` `optional` **extractToken?**: (`req`) => `string` \| `Promise`\<`string` \| `null`\> \| `null`

Defined in: [packages/auth/src/types.ts:518](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L518)

Custom token extraction.
Default: extracts Bearer token from Authorization header.

#### Parameters

##### req

###### header

`Headers`

#### Returns

`string` \| `Promise`\<`string` \| `null`\> \| `null`

***

### mapSession

> `readonly` **mapSession**: (`session`) => [`AuthContext`](AuthContext.md) \| `Promise`\<[`AuthContext`](AuthContext.md)\>

Defined in: [packages/auth/src/types.ts:513](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L513)

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

> `readonly` `optional` **propagatedClaims?**: `string`[]

Defined in: [packages/auth/src/types.ts:530](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L530)

Filter which claims are propagated in headers.
When set, only listed claim keys are included in x-auth-claims header.
When not set, all claims are propagated.

***

### propagateHeaders?

> `readonly` `optional` **propagateHeaders?**: `boolean`

Defined in: [packages/auth/src/types.ts:524](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L524)

Propagate auth context as headers for downstream services

***

### skipMethods?

> `readonly` `optional` **skipMethods?**: `string`[]

Defined in: [packages/auth/src/types.ts:522](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L522)

Methods to skip authentication for

***

### verifySession

> `readonly` **verifySession**: (`token`, `headers`) => `unknown`

Defined in: [packages/auth/src/types.ts:506](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L506)

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
