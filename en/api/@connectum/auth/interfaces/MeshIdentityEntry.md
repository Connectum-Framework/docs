[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / MeshIdentityEntry

# Interface: MeshIdentityEntry

Defined in: [packages/auth/src/types.ts:403](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L403)

An allow-list entry for [meshIdentityTrust](../functions/meshIdentityTrust.md), mapping a verified mesh
identity (the forwarded peer principal) to its authorization context.

## Properties

### name?

> `readonly` `optional` **name?**: `string`

Defined in: [packages/auth/src/types.ts:414](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L414)

Optional human-readable name for the calling service.

***

### principal

> `readonly` **principal**: `string`

Defined in: [packages/auth/src/types.ts:408](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L408)

The mesh-forwarded peer identity to match, e.g. an Istio short-form
ServiceAccount principal `cluster.local/ns/<ns>/sa/<name>` or a SPIFFE id.

***

### roles?

> `readonly` `optional` **roles?**: readonly `string`[]

Defined in: [packages/auth/src/types.ts:410](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L410)

Roles granted to this caller (compose via `requires {roles}`).

***

### scopes?

> `readonly` `optional` **scopes?**: readonly `string`[]

Defined in: [packages/auth/src/types.ts:412](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L412)

Scopes granted to this caller (compose via `requires {scopes}`).
