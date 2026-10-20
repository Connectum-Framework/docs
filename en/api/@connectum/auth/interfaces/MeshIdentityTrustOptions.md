[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / MeshIdentityTrustOptions

# Interface: MeshIdentityTrustOptions

Defined in: [packages/auth/src/types.ts:420](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L420)

Options for [meshIdentityTrust](../functions/meshIdentityTrust.md).

## Properties

### allowlist

> `readonly` **allowlist**: readonly [`MeshIdentityEntry`](MeshIdentityEntry.md)[]

Defined in: [packages/auth/src/types.ts:426](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L426)

Allow-list of permitted mesh identities. Each entry maps a forwarded peer
principal to its roles/scopes. A request whose identity is not on the
list is rejected.

***

### header?

> `readonly` `optional` **header?**: `string`

Defined in: [packages/auth/src/types.ts:431](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L431)

Header carrying the mesh-forwarded peer identity.

#### Default

```ts
"x-forwarded-client-principal"
```

***

### type?

> `readonly` `optional` **type?**: `string`

Defined in: [packages/auth/src/types.ts:433](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L433)

Credential type set on the resulting AuthContext.

#### Default

```ts
"mesh"
```
