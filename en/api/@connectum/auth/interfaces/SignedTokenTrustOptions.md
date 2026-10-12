[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / SignedTokenTrustOptions

# Interface: SignedTokenTrustOptions

Defined in: [packages/auth/src/types.ts:447](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L447)

Options for [signedTokenTrust](../functions/signedTokenTrust.md).

## Properties

### header?

> `readonly` `optional` **header?**: `string`

Defined in: [packages/auth/src/types.ts:459](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L459)

Header carrying the service token. The value may be a bare token or a
`Bearer <token>` value.

#### Default

```ts
"x-internal-token"
```

***

### issuers

> `readonly` **issuers**: `Readonly`\<`Record`\<`string`, [`SignedTokenIssuer`](SignedTokenIssuer.md)\>\>

Defined in: [packages/auth/src/types.ts:453](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L453)

Per-issuer configuration keyed by the issuer (`iss`) value. The keyset is
selected by the token's claimed issuer and verification is pinned to that
same issuer — never a single shared keyset across issuers.

***

### type?

> `readonly` `optional` **type?**: `string`

Defined in: [packages/auth/src/types.ts:461](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L461)

Credential type set on the resulting AuthContext.

#### Default

```ts
"service"
```
