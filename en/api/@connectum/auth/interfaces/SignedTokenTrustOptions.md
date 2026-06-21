[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / SignedTokenTrustOptions

# Interface: SignedTokenTrustOptions

Defined in: [packages/auth/src/types.ts:433](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L433)

Options for [signedTokenTrust](../functions/signedTokenTrust.md).

## Properties

### header?

> `readonly` `optional` **header?**: `string`

Defined in: [packages/auth/src/types.ts:445](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L445)

Header carrying the service token. The value may be a bare token or a
`Bearer <token>` value.

#### Default

```ts
"x-internal-token"
```

***

### issuers

> `readonly` **issuers**: `Readonly`\<`Record`\<`string`, [`SignedTokenIssuer`](SignedTokenIssuer.md)\>\>

Defined in: [packages/auth/src/types.ts:439](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L439)

Per-issuer configuration keyed by the issuer (`iss`) value. The keyset is
selected by the token's claimed issuer and verification is pinned to that
same issuer — never a single shared keyset across issuers.

***

### type?

> `readonly` `optional` **type?**: `string`

Defined in: [packages/auth/src/types.ts:447](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L447)

Credential type set on the resulting AuthContext.

#### Default

```ts
"service"
```
