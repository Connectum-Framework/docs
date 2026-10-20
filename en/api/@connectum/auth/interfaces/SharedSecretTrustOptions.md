[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / SharedSecretTrustOptions

# Interface: SharedSecretTrustOptions

Defined in: [packages/auth/src/types.ts:504](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L504)

Options for [sharedSecretTrust](../functions/sharedSecretTrust.md).

DEV-ONLY: a single shared secret is NOT per-service — one compromise forges
all callers. Use [meshIdentityTrust](../functions/meshIdentityTrust.md) or [signedTokenTrust](../functions/signedTokenTrust.md) in
production. See ADR-029.

## Properties

### header?

> `readonly` `optional` **header?**: `string`

Defined in: [packages/auth/src/types.ts:511](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L511)

Header carrying the shared secret.

#### Default

```ts
"x-internal-secret"
```

***

### roles?

> `readonly` `optional` **roles?**: readonly `string`[]

Defined in: [packages/auth/src/types.ts:518](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L518)

Roles granted to a trusted caller.

***

### scopes?

> `readonly` `optional` **scopes?**: readonly `string`[]

Defined in: [packages/auth/src/types.ts:520](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L520)

Scopes granted to a trusted caller.

***

### secret

> `readonly` **secret**: `string`

Defined in: [packages/auth/src/types.ts:506](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L506)

The shared secret, constant-time compared against the header value.

***

### subject?

> `readonly` `optional` **subject?**: `string`

Defined in: [packages/auth/src/types.ts:516](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L516)

Subject identity assigned to a trusted call.

#### Default

```ts
"internal"
```

***

### type?

> `readonly` `optional` **type?**: `string`

Defined in: [packages/auth/src/types.ts:522](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L522)

Credential type set on the resulting AuthContext.

#### Default

```ts
"internal"
```
