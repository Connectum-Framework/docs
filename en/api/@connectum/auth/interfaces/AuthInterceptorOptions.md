[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / AuthInterceptorOptions

# Interface: AuthInterceptorOptions

Defined in: [packages/auth/src/types.ts:124](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L124)

Generic auth interceptor options

## Properties

### cache?

> `optional` **cache?**: [`CacheOptions`](CacheOptions.md)

Defined in: [packages/auth/src/types.ts:166](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L166)

LRU cache for credentials verification results.
Caches AuthContext by credential string to reduce verification overhead.

***

### extractCredentials?

> `optional` **extractCredentials?**: (`req`) => `string` \| `Promise`\<`string` \| `null`\> \| `null`

Defined in: [packages/auth/src/types.ts:132](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L132)

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

Defined in: [packages/auth/src/types.ts:173](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L173)

Filter which claims are propagated in headers (SEC-001).
When set, only listed claim keys are included in x-auth-claims header.
When not set, all claims are propagated.

***

### propagateHeaders?

> `optional` **propagateHeaders?**: `boolean`

Defined in: [packages/auth/src/types.ts:160](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L160)

Propagate auth context as headers for downstream services.

#### Default

```ts
false
```

***

### skipMethods?

> `optional` **skipMethods?**: `string`[]

Defined in: [packages/auth/src/types.ts:154](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L154)

Methods to skip authentication for.
Patterns: "Service/Method" or "Service/*". The catch-all `"*"` is refused: creating the
interceptor throws, because it would switch authentication off for every method
(to disable the interceptor, do not register it).

#### Default

```ts
[] (health and reflection methods are NOT auto-skipped)
```

***

### verifyCredentials

> **verifyCredentials**: (`credentials`) => [`AuthContext`](AuthContext.md) \| `Promise`\<[`AuthContext`](AuthContext.md)\>

Defined in: [packages/auth/src/types.ts:145](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L145)

Verify credentials and return auth context.
REQUIRED. Must throw on invalid credentials.

Error contract: a thrown `ConnectError` reaches the client unchanged (its code and
message are sent verbatim, so keep the text public); any other thrown value becomes
`Unauthenticated: Authentication failed` and its text is not sent.

#### Parameters

##### credentials

`string`

Extracted credential string

#### Returns

[`AuthContext`](AuthContext.md) \| `Promise`\<[`AuthContext`](AuthContext.md)\>

AuthContext for valid credentials
