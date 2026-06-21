[Connectum API Reference](../../../../index.md) / [@connectum/auth](../../index.md) / [proto](../index.md) / MethodAuth

# Type Alias: MethodAuth

> **MethodAuth** = `Message`\<`"connectum.auth.v1.MethodAuth"`\> & `object`

Defined in: packages/auth/gen/connectum/auth/v1/options\_pb.d.ts:39

Authorization configuration for an RPC method.

## Type Declaration

### internal

> **internal**: `boolean`

Mark the method as internal (service-to-service). Skips end-user (JWT)
authentication, but requires an internal trust marker established by
createInternalAuthInterceptor (a per-service trust source). Distinct from
`public`: `public` is world-open (no auth at all); `internal` is reachable
only by a trusted internal caller. A method is at most one of
`public` / `internal` / gated. See ADR-029.

#### Generated

from field: optional bool internal = 4;

### policy

> **policy**: `string`

Override the service-level default_policy for this method.
Valid values: "allow", "deny".

#### Generated

from field: optional string policy = 3;

### public

> **public**: `boolean`

Skip both authentication and authorization for this method.

#### Generated

from field: optional bool public = 1;

### requires?

> `optional` **requires?**: [`AuthRequirements`](AuthRequirements.md)

Access requirements (roles/scopes) for this method.

#### Generated

from field: optional connectum.auth.v1.AuthRequirements requires = 2;

## Generated

from message connectum.auth.v1.MethodAuth
