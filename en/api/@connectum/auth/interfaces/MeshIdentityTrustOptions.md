[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / MeshIdentityTrustOptions

# Interface: MeshIdentityTrustOptions

Defined in: [packages/auth/src/types.ts:391](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L391)

Options for [meshIdentityTrust](../functions/meshIdentityTrust.md).

## Properties

### allowlist

> `readonly` **allowlist**: readonly [`MeshIdentityEntry`](MeshIdentityEntry.md)[]

Defined in: [packages/auth/src/types.ts:397](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L397)

Allow-list of permitted mesh identities. Each entry maps a forwarded peer
principal to its roles/scopes. A request whose identity is not on the
list is rejected.

***

### header?

> `readonly` `optional` **header?**: `string`

Defined in: [packages/auth/src/types.ts:402](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L402)

Header carrying the mesh-forwarded peer identity.

#### Default

```ts
"x-forwarded-client-principal"
```

***

### type?

> `readonly` `optional` **type?**: `string`

Defined in: [packages/auth/src/types.ts:404](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L404)

Credential type set on the resulting AuthContext.

#### Default

```ts
"mesh"
```
