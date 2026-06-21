[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / MeshIdentityTrustOptions

# Interface: MeshIdentityTrustOptions

Defined in: [packages/auth/src/types.ts:383](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L383)

Options for [meshIdentityTrust](../functions/meshIdentityTrust.md).

## Properties

### allowlist

> `readonly` **allowlist**: readonly [`MeshIdentityEntry`](MeshIdentityEntry.md)[]

Defined in: [packages/auth/src/types.ts:389](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L389)

Allow-list of permitted mesh identities. Each entry maps a forwarded peer
principal to its roles/scopes. A request whose identity is not on the
list is rejected.

***

### header?

> `readonly` `optional` **header?**: `string`

Defined in: [packages/auth/src/types.ts:394](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L394)

Header carrying the mesh-forwarded peer identity.

#### Default

```ts
"x-forwarded-client-principal"
```

***

### type?

> `readonly` `optional` **type?**: `string`

Defined in: [packages/auth/src/types.ts:396](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L396)

Credential type set on the resulting AuthContext.

#### Default

```ts
"mesh"
```
