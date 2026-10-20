[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / SessionAuthInterceptorOptions

# Interface: SessionAuthInterceptorOptions

Defined in: [packages/auth/src/types.ts:530](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L530)

Session-based auth interceptor options.

Two-step authentication: verify session token, then map session data to AuthContext.

## Properties

### cache?

> `readonly` `optional` **cache?**: [`CacheOptions`](CacheOptions.md)

Defined in: [packages/auth/src/types.ts:558](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L558)

LRU cache for session verification results

***

### extractToken?

> `readonly` `optional` **extractToken?**: (`req`) => `string` \| `Promise`\<`string` \| `null`\> \| `null`

Defined in: [packages/auth/src/types.ts:556](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L556)

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

Defined in: [packages/auth/src/types.ts:551](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L551)

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

Defined in: [packages/auth/src/types.ts:571](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L571)

Filter which claims are propagated in headers.
When set, only listed claim keys are included in x-auth-claims header.
When not set, all claims are propagated.

***

### propagateHeaders?

> `readonly` `optional` **propagateHeaders?**: `boolean`

Defined in: [packages/auth/src/types.ts:565](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L565)

Propagate auth context as headers for downstream services.
An identity containing NUL, CR or LF is rejected with `Unauthenticated` (and never cached) while this is on.

***

### skipMethods?

> `readonly` `optional` **skipMethods?**: `string`[]

Defined in: [packages/auth/src/types.ts:560](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L560)

Methods to skip authentication for. The catch-all `"*"` is refused (creation throws).

***

### verifySession

> `readonly` **verifySession**: (`token`, `headers`) => `unknown`

Defined in: [packages/auth/src/types.ts:544](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L544)

Verify session token and return raw session data.
Must throw on invalid/expired sessions.

Error contract: a thrown `ConnectError` reaches the client unchanged (code and message
verbatim, so keep the text public); any other thrown value becomes
`Unauthenticated: Session verification failed`. The same holds for `mapSession`
(fixed text `Session mapping failed`).

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
