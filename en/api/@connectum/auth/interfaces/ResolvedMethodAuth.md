[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / ResolvedMethodAuth

# Interface: ResolvedMethodAuth

Defined in: [packages/auth/src/proto/reader.ts:20](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/auth/src/proto/reader.ts#L20)

Resolved authorization configuration for a single RPC method.

Result of merging service-level defaults with method-level overrides.

## Properties

### policy

> `readonly` **policy**: `"allow"` \| `"deny"` \| `undefined`

Defined in: [packages/auth/src/proto/reader.ts:24](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/auth/src/proto/reader.ts#L24)

Authorization policy: "allow", "deny", or undefined (use interceptor default).

***

### public

> `readonly` **public**: `boolean`

Defined in: [packages/auth/src/proto/reader.ts:22](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/auth/src/proto/reader.ts#L22)

Whether the method is public (skip authn + authz).

***

### requires

> `readonly` **requires**: \{ `roles`: readonly `string`[]; `scopes`: readonly `string`[]; \} \| `undefined`

Defined in: [packages/auth/src/proto/reader.ts:26](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/auth/src/proto/reader.ts#L26)

Required roles and scopes, or undefined if none specified.
