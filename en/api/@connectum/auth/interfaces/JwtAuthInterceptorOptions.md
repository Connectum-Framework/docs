[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / JwtAuthInterceptorOptions

# Interface: JwtAuthInterceptorOptions

Defined in: [packages/auth/src/types.ts:226](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L226)

JWT auth interceptor options

## Properties

### algorithms?

> `optional` **algorithms?**: `string`[]

Defined in: [packages/auth/src/types.ts:285](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L285)

Allowed algorithms

***

### audience?

> `optional` **audience?**: `string` \| `string`[]

Defined in: [packages/auth/src/types.ts:283](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L283)

Expected audience(s). Omit the option to skip the check. A present value must be a non-empty
string or an array of non-empty strings; an empty string throws when the interceptor is created.

***

### claimsMapping?

> `optional` **claimsMapping?**: `object`

Defined in: [packages/auth/src/types.ts:290](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L290)

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

Defined in: [packages/auth/src/types.ts:278](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L278)

Expected issuer(s). Omit the option to skip the check. A present value must be a non-empty
string or an array of non-empty strings; an empty string throws when the interceptor is created.

***

### jwks?

> `optional` **jwks?**: [`JwksOptions`](JwksOptions.md)

Defined in: [packages/auth/src/types.ts:235](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L235)

Refresh and timeout settings of the remote key set. Only valid together with `jwksUri`
(setting it without one throws when the interceptor is created); an unknown name or a value
out of range throws too. Omit it to keep jose's defaults: 30 s cooldown, 10 min cache age,
5 s request timeout.

***

### jwksUri?

> `optional` **jwksUri?**: `string`

Defined in: [packages/auth/src/types.ts:228](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L228)

JWKS endpoint URL for remote key set

***

### maxTokenAge?

> `optional` **maxTokenAge?**: `string` \| `number`

Defined in: [packages/auth/src/types.ts:305](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L305)

Maximum token age.
Passed to jose jwtVerify options.
Number (seconds) or string (e.g., "2h", "7d"). Omit the option to skip the check; `0`, a
negative or non-finite number, a blank string, a text jose cannot read ("1month") and a text
jose reads as zero or negative ("0s", "-1h", "1h ago") throw when the interceptor is created.

***

### propagatedClaims?

> `optional` **propagatedClaims?**: `string`[]

Defined in: [packages/auth/src/types.ts:336](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L336)

Filter which claims are propagated in headers, as for `createAuthInterceptor`.
When set, only the listed claim names are written to `x-auth-claims` (no header when none of
them is in the token); when not set, every claim of the token is. Applies only with
`propagateHeaders`. A value that is not an array of non-empty strings throws when the
interceptor is created.

***

### propagateHeaders?

> `optional` **propagateHeaders?**: `boolean`

Defined in: [packages/auth/src/types.ts:328](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L328)

Propagate auth context as headers for downstream services.
A subject, type, name or scope containing NUL, CR or LF is rejected with
`Unauthenticated` (and never cached) while this is on.
Text above U+00FF is written as `utf-8''` plus percent-encoded UTF-8 (with `x-auth-encoding: percent-utf8`) and read back by the receiver.
An identity that does not fit its header (subject over 512 characters, type over 128, name over
256, serialized roles, scopes or claims over 8192) is rejected too, instead of being cut or left out.

#### Default

```ts
false
```

***

### publicKey?

> `optional` **publicKey?**: `CryptoKey`

Defined in: [packages/auth/src/types.ts:273](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L273)

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

Defined in: [packages/auth/src/types.ts:313](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L313)

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

Defined in: [packages/auth/src/types.ts:237](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L237)

HMAC symmetric secret (for HS256/HS384/HS512)

***

### skipMethods?

> `optional` **skipMethods?**: `string`[]

Defined in: [packages/auth/src/types.ts:318](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L318)

Methods to skip authentication for. The catch-all `"*"` is refused (creation throws).

#### Default

```ts
[]
```
