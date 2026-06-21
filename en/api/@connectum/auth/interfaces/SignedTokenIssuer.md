[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / SignedTokenIssuer

# Interface: SignedTokenIssuer

Defined in: [packages/auth/src/types.ts:407](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L407)

Per-issuer JWKS configuration for [signedTokenTrust](../functions/signedTokenTrust.md).

The JWKS lookup is issuer-bound: the keyset is selected by the token's `iss`
claim and verification is pinned to that same issuer. This is a hard security
requirement — a single shared JWKS holding multiple services' keys does NOT
contain compromise (jose resolves the key by `kid` independently of `iss`).

## Properties

### algorithms?

> `readonly` `optional` **algorithms?**: `string`[]

Defined in: [packages/auth/src/types.ts:413](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L413)

Allowed signing algorithms.

#### Default

```ts
["RS256"]
```

***

### audience?

> `readonly` `optional` **audience?**: `string` \| `string`[]

Defined in: [packages/auth/src/types.ts:411](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L411)

Expected audience(s) for tokens from this issuer.

***

### claimsMapping?

> `readonly` `optional` **claimsMapping?**: `object`

Defined in: [packages/auth/src/types.ts:420](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L420)

Mapping from token claims to AuthContext fields (dot-notation paths).
`subject` defaults to `sub ?? iss`; `roles`/`scopes` to none unless mapped.

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

Defined in: [packages/auth/src/types.ts:409](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L409)

The issuer's JWKS endpoint URL (its own keyset only).

***

### maxTokenAge?

> `readonly` `optional` **maxTokenAge?**: `string` \| `number`

Defined in: [packages/auth/src/types.ts:415](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L415)

Maximum token age (seconds or string like "2h").
