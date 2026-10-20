[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / SignedTokenIssuer

# Interface: SignedTokenIssuer

Defined in: [packages/auth/src/types.ts:444](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L444)

Per-issuer JWKS configuration for [signedTokenTrust](../functions/signedTokenTrust.md).

The JWKS lookup is issuer-bound: the keyset is selected by the token's `iss`
claim and verification is pinned to that same issuer. This is a hard security
requirement — a single shared JWKS holding multiple services' keys does NOT
contain compromise (jose resolves the key by `kid` independently of `iss`).

## Properties

### algorithms?

> `readonly` `optional` **algorithms?**: `string`[]

Defined in: [packages/auth/src/types.ts:450](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L450)

Allowed signing algorithms.

#### Default

```ts
["RS256"]
```

***

### audience?

> `readonly` `optional` **audience?**: `string` \| `string`[]

Defined in: [packages/auth/src/types.ts:448](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L448)

Expected audience(s) for tokens from this issuer.

***

### claimsMapping?

> `readonly` `optional` **claimsMapping?**: `object`

Defined in: [packages/auth/src/types.ts:467](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L467)

Mapping from token claims to AuthContext fields (dot-notation paths).

Only a claim named here is read. `subject` is the verified `iss` unless
`claimsMapping.subject` names another claim (then a missing or non-string value
rejects the call); `roles` and `scopes` are empty unless mapped, and the standard
`scope` claim grants nothing until `claimsMapping.scopes` points at it.

#### name?

> `readonly` `optional` **name?**: `string`

#### roles?

> `readonly` `optional` **roles?**: `string`

#### scopes?

> `readonly` `optional` **scopes?**: `string`

#### subject?

> `readonly` `optional` **subject?**: `string`

***

### jwksUri

> `readonly` **jwksUri**: `string`

Defined in: [packages/auth/src/types.ts:446](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L446)

The issuer's JWKS endpoint URL (its own keyset only).

***

### maxTokenAge?

> `readonly` `optional` **maxTokenAge?**: `string` \| `number`

Defined in: [packages/auth/src/types.ts:452](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L452)

Maximum token age (seconds or string like "2h").

***

### requireExpiration?

> `readonly` `optional` **requireExpiration?**: `boolean`

Defined in: [packages/auth/src/types.ts:458](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L458)

Reject a token from this issuer that has no `exp` claim: a signed token
without `exp` never expires. Set `false` only for an issuer that cannot add it.

#### Default

```ts
true
```
