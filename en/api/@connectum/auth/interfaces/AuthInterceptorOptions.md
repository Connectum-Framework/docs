[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / AuthInterceptorOptions

# Interface: AuthInterceptorOptions

Defined in: [packages/auth/src/types.ts:115](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L115)

Generic auth interceptor options

## Properties

### cache?

> `optional` **cache**: [`CacheOptions`](CacheOptions.md)

Defined in: [packages/auth/src/types.ts:151](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L151)

LRU cache for credentials verification results.
Caches AuthContext by credential string to reduce verification overhead.

***

### extractCredentials()?

> `optional` **extractCredentials**: (`req`) => `string` \| `Promise`\<`string` \| `null`\> \| `null`

Defined in: [packages/auth/src/types.ts:123](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L123)

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

> `optional` **propagatedClaims**: `string`[]

Defined in: [packages/auth/src/types.ts:158](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L158)

Filter which claims are propagated in headers (SEC-001).
When set, only listed claim keys are included in x-auth-claims header.
When not set, all claims are propagated.

***

### propagateHeaders?

> `optional` **propagateHeaders**: `boolean`

Defined in: [packages/auth/src/types.ts:145](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L145)

Propagate auth context as headers for downstream services.

#### Default

```ts
false
```

***

### skipMethods?

> `optional` **skipMethods**: `string`[]

Defined in: [packages/auth/src/types.ts:139](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L139)

Methods to skip authentication for.
Patterns: "Service/Method" or "Service/*"

#### Default

```ts
[] (health and reflection methods are NOT auto-skipped)
```

***

### verifyCredentials()

> **verifyCredentials**: (`credentials`) => [`AuthContext`](AuthContext.md) \| `Promise`\<[`AuthContext`](AuthContext.md)\>

Defined in: [packages/auth/src/types.ts:132](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L132)

Verify credentials and return auth context.
REQUIRED. Must throw on invalid credentials.

#### Parameters

##### credentials

`string`

Extracted credential string

#### Returns

[`AuthContext`](AuthContext.md) \| `Promise`\<[`AuthContext`](AuthContext.md)\>

AuthContext for valid credentials
