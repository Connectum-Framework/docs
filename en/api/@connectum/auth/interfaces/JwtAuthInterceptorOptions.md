[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / JwtAuthInterceptorOptions

# Interface: JwtAuthInterceptorOptions

Defined in: [packages/auth/src/types.ts:179](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L179)

JWT auth interceptor options

## Properties

### algorithms?

> `optional` **algorithms?**: `string`[]

Defined in: [packages/auth/src/types.ts:225](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L225)

Allowed algorithms

***

### audience?

> `optional` **audience?**: `string` \| `string`[]

Defined in: [packages/auth/src/types.ts:223](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L223)

Expected audience(s)

***

### claimsMapping?

> `optional` **claimsMapping?**: `object`

Defined in: [packages/auth/src/types.ts:230](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L230)

Mapping from JWT claims to AuthContext fields.
Supports dot-notation paths (e.g., "realm_access.roles").

#### name?

> `optional` **name?**: `string`

#### roles?

> `optional` **roles?**: `string`

#### scopes?

> `optional` **scopes?**: `string`

#### subject?

> `optional` **subject?**: `string`

***

### issuer?

> `optional` **issuer?**: `string` \| `string`[]

Defined in: [packages/auth/src/types.ts:221](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L221)

Expected issuer(s)

***

### jwksUri?

> `optional` **jwksUri?**: `string`

Defined in: [packages/auth/src/types.ts:181](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L181)

JWKS endpoint URL for remote key set

***

### maxTokenAge?

> `optional` **maxTokenAge?**: `string` \| `number`

Defined in: [packages/auth/src/types.ts:243](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L243)

Maximum token age.
Passed to jose jwtVerify options.
Number (seconds) or string (e.g., "2h", "7d").

***

### propagateHeaders?

> `optional` **propagateHeaders?**: `boolean`

Defined in: [packages/auth/src/types.ts:263](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L263)

Propagate auth context as headers for downstream services.
A subject, type, name or scope containing NUL, CR or LF is rejected with
`Unauthenticated` (and never cached) while this is on.

#### Default

```ts
false
```

***

### publicKey?

> `optional` **publicKey?**: `CryptoKey`

Defined in: [packages/auth/src/types.ts:219](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L219)

Asymmetric public key for JWT signature verification.

Supported algorithms:
- **RSA**: RS256, RS384, RS512
- **RSA-PSS**: PS256, PS384, PS512
- **EC (ECDSA)**: ES256, ES384, ES512
- **EdDSA**: Ed25519, Ed448

Import a PEM-encoded key via Web Crypto API:

#### Examples

**RSA public key**

```typescript
const rsaKey = await crypto.subtle.importKey(
  "spki",
  pemToArrayBuffer(rsaPem),
  { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
  true,
  ["verify"],
);
```

**EC public key**

```typescript
const ecKey = await crypto.subtle.importKey(
  "spki",
  pemToArrayBuffer(ecPem),
  { name: "ECDSA", namedCurve: "P-256" },
  true,
  ["verify"],
);
```

#### See

[jose CryptoKey documentation](https://github.com/panva/jose/blob/main/docs/types/types.CryptoKey.md)

***

### requireExpiration?

> `optional` **requireExpiration?**: `boolean`

Defined in: [packages/auth/src/types.ts:251](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L251)

Reject a token that has no `exp` (expiration time) claim. A signed token
without `exp` never expires, so a leaked one stays valid until the signing
key is rotated; RFC 9068 requires `exp` in JWT access tokens. Set `false`
only for a trusted issuer that cannot add `exp`.

#### Default

```ts
true
```

***

### secret?

> `optional` **secret?**: `string`

Defined in: [packages/auth/src/types.ts:183](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L183)

HMAC symmetric secret (for HS256/HS384/HS512)

***

### skipMethods?

> `optional` **skipMethods?**: `string`[]

Defined in: [packages/auth/src/types.ts:256](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L256)

Methods to skip authentication for. The catch-all `"*"` is refused (creation throws).

#### Default

```ts
[]
```
