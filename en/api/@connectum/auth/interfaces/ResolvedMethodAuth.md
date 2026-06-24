[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / ResolvedMethodAuth

# Interface: ResolvedMethodAuth

Defined in: [packages/auth/src/proto/reader.ts:20](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/proto/reader.ts#L20)

Resolved authorization configuration for a single RPC method.

Result of merging service-level defaults with method-level overrides.

## Properties

### internal

> `readonly` **internal**: `boolean`

Defined in: [packages/auth/src/proto/reader.ts:28](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/proto/reader.ts#L28)

Whether the method is internal (service-to-service): skip end-user (JWT)
authentication, but require an internal trust marker established by
[createInternalAuthInterceptor](../functions/createInternalAuthInterceptor.md). Distinct from `public`. See ADR-029.

***

### policy

> `readonly` **policy**: `"allow"` \| `"deny"` \| `undefined`

Defined in: [packages/auth/src/proto/reader.ts:30](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/proto/reader.ts#L30)

Authorization policy: "allow", "deny", or undefined (use interceptor default).

***

### public

> `readonly` **public**: `boolean`

Defined in: [packages/auth/src/proto/reader.ts:22](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/proto/reader.ts#L22)

Whether the method is public (skip authn + authz).

***

### requires

> `readonly` **requires**: \{ `roles`: readonly `string`[]; `scopes`: readonly `string`[]; \} \| `undefined`

Defined in: [packages/auth/src/proto/reader.ts:32](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/proto/reader.ts#L32)

Required roles and scopes, or undefined if none specified.
