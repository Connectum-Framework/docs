[Connectum API Reference](../../../../../index.md) / [@connectum/auth](../../../index.md) / [@connectum/auth](../index.md) / JwtAuthInterceptorOptions

# Interface: JwtAuthInterceptorOptions

Defined in: [packages/auth/src/types.ts:164](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L164)

JWT auth interceptor options

## Properties

### algorithms?

> `optional` **algorithms**: `string`[]

Defined in: [packages/auth/src/types.ts:210](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L210)

Allowed algorithms

***

### audience?

> `optional` **audience**: `string` \| `string`[]

Defined in: [packages/auth/src/types.ts:208](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L208)

Expected audience(s)

***

### claimsMapping?

> `optional` **claimsMapping**: `object`

Defined in: [packages/auth/src/types.ts:215](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L215)

Mapping from JWT claims to AuthContext fields.
Supports dot-notation paths (e.g., "realm_access.roles").

#### name?

> `optional` **name**: `string`

#### roles?

> `optional` **roles**: `string`

#### scopes?

> `optional` **scopes**: `string`

#### subject?

> `optional` **subject**: `string`

***

### issuer?

> `optional` **issuer**: `string` \| `string`[]

Defined in: [packages/auth/src/types.ts:206](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L206)

Expected issuer(s)

***

### jwksUri?

> `optional` **jwksUri**: `string`

Defined in: [packages/auth/src/types.ts:166](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L166)

JWKS endpoint URL for remote key set

***

### maxTokenAge?

> `optional` **maxTokenAge**: `string` \| `number`

Defined in: [packages/auth/src/types.ts:228](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L228)

Maximum token age.
Passed to jose jwtVerify options.
Number (seconds) or string (e.g., "2h", "7d").

***

### propagateHeaders?

> `optional` **propagateHeaders**: `boolean`

Defined in: [packages/auth/src/types.ts:238](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L238)

Propagate auth context as headers for downstream services.

#### Default

```ts
false
```

***

### publicKey?

> `optional` **publicKey**: `CryptoKey`

Defined in: [packages/auth/src/types.ts:204](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L204)

Asymmetric public key for JWT signature verification.

Supported algorithms:
- **RSA**: RS256, RS384, RS512
- **RSA-PSS**: PS256, PS384, PS512
- **EC (ECDSA)**: ES256, ES384, ES512
- **EdDSA**: Ed25519, Ed448

Import a PEM-encoded key via Web Crypto API:

#### Examples

```typescript
const rsaKey = await crypto.subtle.importKey(
  "spki",
  pemToArrayBuffer(rsaPem),
  { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
  true,
  ["verify"],
);
```

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

### secret?

> `optional` **secret**: `string`

Defined in: [packages/auth/src/types.ts:168](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L168)

HMAC symmetric secret (for HS256/HS384/HS512)

***

### skipMethods?

> `optional` **skipMethods**: `string`[]

Defined in: [packages/auth/src/types.ts:233](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L233)

Methods to skip authentication for.

#### Default

```ts
[]
```
