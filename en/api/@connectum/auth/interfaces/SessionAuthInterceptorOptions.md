[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / SessionAuthInterceptorOptions

# Interface: SessionAuthInterceptorOptions

Defined in: [packages/auth/src/types.ts:625](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L625)

Session-based auth interceptor options.

Two-step authentication: verify session token, then map session data to AuthContext.

## Properties

### cache?

> `readonly` `optional` **cache?**: [`CacheOptions`](CacheOptions.md)

Defined in: [packages/auth/src/types.ts:662](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L662)

LRU cache for session verification results. Every request receives its own copy of the stored
identity, as described for `AuthInterceptorOptions.cache`.

***

### extractToken?

> `readonly` `optional` **extractToken?**: (`req`) => `string` \| `Promise`\<`string` \| `null`\> \| `null`

Defined in: [packages/auth/src/types.ts:657](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L657)

Custom token extraction.
Default: extracts Bearer token from Authorization header.
`verifySession`, `mapSession` and a set `extractToken` must be functions; creating the
interceptor throws a `TypeError` naming the option otherwise.

#### Parameters

##### req

###### header

`Headers`

#### Returns

`string` \| `Promise`\<`string` \| `null`\> \| `null`

***

### mapSession

> `readonly` **mapSession**: (`session`) => [`AuthContext`](AuthContext.md) \| `Promise`\<[`AuthContext`](AuthContext.md)\>

Defined in: [packages/auth/src/types.ts:650](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L650)

Map raw session data to AuthContext.

A result that is not an `AuthContext` (`null`, `undefined`, `false`, `{}`, a missing or
mistyped `subject`, `type`, `roles`, `scopes` or `claims`) ends the call with
`Unauthenticated: Session mapping failed`; it is never cached.

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

Defined in: [packages/auth/src/types.ts:675](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L675)

Filter which claims are propagated in headers.
When set, only listed claim keys are included in x-auth-claims header.
When not set, all claims are propagated.

***

### propagateHeaders?

> `readonly` `optional` **propagateHeaders?**: `boolean`

Defined in: [packages/auth/src/types.ts:669](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L669)

Propagate auth context as headers for downstream services.
An identity containing NUL, CR or LF is rejected with `Unauthenticated` (and never cached) while this is on. Text above U+00FF is written as `utf-8''` plus percent-encoded UTF-8 (with `x-auth-encoding: percent-utf8`) and read back by the receiver. An identity that does not fit its header (subject over 512 characters, type over 128, name over 256, serialized roles, scopes or claims over 8192) is rejected too, never cut or left out.

***

### skipMethods?

> `readonly` `optional` **skipMethods?**: `string`[]

Defined in: [packages/auth/src/types.ts:664](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L664)

Methods to skip authentication for. The catch-all `"*"` is refused (creation throws).

***

### verifySession

> `readonly` **verifySession**: (`token`, `headers`) => `unknown`

Defined in: [packages/auth/src/types.ts:639](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L639)

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
