[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / AuthInterceptorOptions

# Interface: AuthInterceptorOptions

Defined in: [packages/auth/src/types.ts:129](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L129)

Generic auth interceptor options

## Properties

### cache?

> `optional` **cache?**: [`CacheOptions`](CacheOptions.md)

Defined in: [packages/auth/src/types.ts:179](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L179)

LRU cache for credentials verification results.
Caches AuthContext by credential string to reduce verification overhead.

The cache stores a private copy of the identity, and every request served from it receives its
own copy (including `roles`, `scopes` and `claims`, nested plain objects and arrays too), so a
handler that changes its `AuthContext` does not change what a later request with the same
credential receives. Each hit costs one pass over the identity, proportional to its size.

***

### extractCredentials?

> `optional` **extractCredentials?**: (`req`) => `string` \| `Promise`\<`string` \| `null`\> \| `null`

Defined in: [packages/auth/src/types.ts:137](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L137)

Extract credentials from request.
Default: extracts Bearer token from Authorization header.

#### Parameters

##### req

Request with headers

###### header

`Headers`

#### Returns

`string` \| `Promise`\<`string` \| `null`\> \| `null`

Credential string or null if no credentials found

***

### propagatedClaims?

> `optional` **propagatedClaims?**: `string`[]

Defined in: [packages/auth/src/types.ts:186](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L186)

Filter which claims are propagated in headers (SEC-001).
When set, only listed claim keys are included in x-auth-claims header.
When not set, all claims are propagated.

***

### propagateHeaders?

> `optional` **propagateHeaders?**: `boolean`

Defined in: [packages/auth/src/types.ts:168](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L168)

Propagate auth context as headers for downstream services.

#### Default

```ts
false
```

***

### skipMethods?

> `optional` **skipMethods?**: `string`[]

Defined in: [packages/auth/src/types.ts:162](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L162)

Methods to skip authentication for.
Patterns: "Service/Method" or "Service/*"; any other pattern, a partial wildcard included, throws
when the interceptor is created. The catch-all `"*"` is refused: creating the
interceptor throws, because it would switch authentication off for every method
(to disable the interceptor, do not register it).

#### Default

```ts
[] (health and reflection methods are NOT auto-skipped)
```

***

### verifyCredentials

> **verifyCredentials**: (`credentials`) => [`AuthContext`](AuthContext.md) \| `Promise`\<[`AuthContext`](AuthContext.md)\>

Defined in: [packages/auth/src/types.ts:152](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L152)

Verify credentials and return auth context.
REQUIRED. Must throw on invalid credentials.

Error contract: a thrown `ConnectError` reaches the client unchanged (its code and
message are sent verbatim, so keep the text public); any other thrown value becomes
`Unauthenticated: Authentication failed` and its text is not sent. A returned value that is
not an `AuthContext` (`null`, `undefined`, `false`, `{}`, a missing or mistyped `subject`,
`type`, `roles`, `scopes` or `claims`) is treated the same way and is never cached.

#### Parameters

##### credentials

`string`

Extracted credential string

#### Returns

[`AuthContext`](AuthContext.md) \| `Promise`\<[`AuthContext`](AuthContext.md)\>

AuthContext for valid credentials
