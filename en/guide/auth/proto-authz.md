---
title: Define Authorization in Proto
description: Attach method access policy to proto options and resolve it at runtime.
docType: how-to
outline: deep
---

# Proto-Based Authorization

This guide targets the documented `1.3.x` release line. Features marked `Since
1.3.0` require `@connectum/auth` 1.3.0 or later; they are unavailable from the
published `1.2.x` package until 1.3.0 is released.

Define authorization rules directly in `.proto` files using custom options. The `createProtoAuthzInterceptor()` reads these options at runtime via protobuf reflection -- no code changes when access rules evolve.

## Proto Options

Import `connectum/auth/v1/options.proto` and annotate services and methods:

```protobuf
syntax = "proto3";

package user.v1;

import "connectum/auth/v1/options.proto";

service UserService {
  // Service-level default: deny unless explicitly allowed
  option (connectum.auth.v1.service_auth) = {
    default_policy: "deny"
  };

  // Public endpoint -- authn must also skip this method (see setup below)
  rpc GetProfile(GetProfileRequest) returns (GetProfileResponse) {
    option (connectum.auth.v1.method_auth) = { public: true };
  }

  // Requires "admin" role
  rpc DeleteUser(DeleteUserRequest) returns (DeleteUserResponse) {
    option (connectum.auth.v1.method_auth) = {
      requires: { roles: ["admin"] }
    };
  }

  // Requires the "users:write" scope
  rpc UpdateUser(UpdateUserRequest) returns (UpdateUserResponse) {
    option (connectum.auth.v1.method_auth) = {
      requires: { scopes: ["users:write"] }
    };
  }

  // Inherits service-level default_policy (deny)
  rpc ListUsers(ListUsersRequest) returns (ListUsersResponse) {}
}
```

### Available Options

#### `service_auth` (service-level)

| Field | Type | Description |
|-------|------|-------------|
| `default_policy` | `string` | `"allow"` or `"deny"` when no proto requirements apply; precedes programmatic rules |
| `default_requires` | `AuthRequirements` | Default roles/scopes for all methods |
| `public` | `bool` | Skip proto authz for all methods; also configure authentication `skipMethods` |
| `internal` | `bool` | Mark all methods as internal (service-to-service). Skips end-user JWT auth; requires a trust marker from `createInternalAuthInterceptor`. Since 1.1.0. See [ADR-029](/en/contributing/adr/029-internal-service-to-service-auth). |

#### `method_auth` (method-level)

| Field | Type | Description |
|-------|------|-------------|
| `public` | `bool` | Skip proto authz; also configure authentication `skipMethods` |
| `requires` | `AuthRequirements` | Required roles and/or scopes |
| `policy` | `string` | Override service-level default policy |
| `internal` | `bool` | Mark the method as internal (service-to-service). Distinct from `public`: world-open vs. trusted-caller-only. Since 1.1.0. |

#### `AuthRequirements`

| Field | Type | Semantics |
|-------|------|-----------|
| `roles` | `repeated string` | **any-of** -- user needs at least one |
| `scopes` | `repeated string` | **all-of** -- user needs every scope |

Explicit method-level fields override their service-level counterparts. An
omitted field inherits the service setting; for the optional booleans, explicit
`false` can override service-level `true`.

### Generating Code for Annotated Protos

`connectum/auth/v1/options.proto` ships in the `@connectum/auth` package (`proto/`
directory). Add it to `buf.yaml` as a module so buf can compile your imports:

```yaml
version: v2
modules:
  - path: proto
  - path: node_modules/@connectum/auth/proto
```

Since 1.3.0, the package also exports the generated code of that proto at
`@connectum/auth/gen/connectum/auth/v1/options_pb.js` — the same module
`@connectum/auth/proto` uses. Import it instead of generating a local copy: in
`buf.gen.yaml`, generate from your own protos only and map the import (`protoc-gen-es`
2.15.0 or later):

```yaml
version: v2
clean: true
inputs:
  - directory: proto
plugins:
  - local: protoc-gen-es
    out: gen
    opt:
      - target=ts
      - import_extension=.ts
      - map_imports=connectum/auth/v1/:@connectum/auth/gen
```

The generated `*_pb.ts` files then import `file_connectum_auth_v1_options` from
`@connectum/auth/gen/connectum/auth/v1/options_pb.js`, and `gen/` holds no
`connectum/auth/v1/options_pb.ts`. `connectum init --auth` sets this up; see
[Scaffolding](/en/guide/scaffolding#connectum-option-protos).

## Interceptor Setup

```typescript
import { createProtoAuthzInterceptor } from '@connectum/auth';

const authz = createProtoAuthzInterceptor();
```

The interceptor reads proto options at runtime. Authentication remains a
separate interceptor; it does not automatically learn which methods are public
or internal. Configure the chain and method lists as shown below.

### With Fallback Rules

Combine proto options with fallback code-based rules. They run only when the
resolved proto options make no decision. An inherited service policy counts as
a proto decision even if a method has no annotation of its own.

```typescript
import { createProtoAuthzInterceptor } from '@connectum/auth';

const authz = createProtoAuthzInterceptor({
  defaultPolicy: 'deny',
  rules: [
    { name: 'admin-all', methods: ['admin.v1.AdminService/*'], requires: { roles: ['admin'] }, effect: 'allow' },
  ],
  authorize: (ctx, req) => ctx.roles.includes('superadmin'),
});
```

## Decision Flow

The interceptor checks the following stages in order. Every allow passes the
request to the next interceptor; every deny throws and ends authorization.

| Order | Condition | Outcome |
|---|---|---|
| 1. Proto `public` | Resolved method is public | Allow through this authorization interceptor without checking context. This does not configure authentication; add the method to authn `skipMethods` separately. |
| 2. Proto `internal` | Resolved method is internal | A missing `AuthContext` throws `Unauthenticated`. If `requires` is `undefined`, allow any caller whose trusted internal context was established upstream. If `requires` is defined, continue to the requirements check below; internal identity and roles/scopes compose inclusively. |
| 3. Proto `requires` | Requirements are defined, including for an internal method | Missing context throws `Unauthenticated`. Satisfied roles/scopes allow immediately, even if a resolved proto policy is `deny`. Unsatisfied requirements throw `AuthzDeniedError` (`PermissionDenied`) without checking policy, rules, or callback. |
| 4. Proto policy | No earlier proto decision; resolved policy is `allow` or `deny` | `allow` passes the request; `deny` throws `AuthzDeniedError` (`PermissionDenied`). An unset policy continues. |
| 5. Programmatic rules | No proto decision; inspect rules in order | The first method-matching rule with no `requires` matches unconditionally, even without context. A rule with `requires` is skipped if context is missing or its requirements fail; evaluation continues. A matching allow passes the request; a matching deny throws `AuthzDeniedError` (`PermissionDenied`). If no rule matches, continue. |
| 6. `authorize` callback | No earlier decision and a callback is configured | Missing context throws `Unauthenticated`. The callback receives the context and method. `true` passes the request; `false` throws `ConnectError` (`PermissionDenied`). The callback is terminal and is not followed by `defaultPolicy`. |
| 7. `defaultPolicy` | No earlier decision and no callback is configured | `allow` passes the request, with or without context. `deny` throws `Unauthenticated` when context is missing and `ConnectError` (`PermissionDenied`) when context exists. |

For internal methods, `requires === undefined` is distinct from a defined
requirements object: the former allows a trusted internal caller immediately;
the latter requires a context and evaluates its roles/scopes. An object with
empty role and scope lists is still defined and passes the requirements check
when context exists.

## Syncing Public Methods with Authentication

Use `getPublicMethods()` to extract public method patterns from proto options and pass them to your authentication interceptor's `skipMethods`:

```typescript
import { createJwtAuthInterceptor, createProtoAuthzInterceptor, getPublicMethods } from '@connectum/auth';
import { UserService } from '#gen/user/v1/user_pb.ts';

const publicMethods = getPublicMethods([UserService]);
// ["user.v1.UserService/GetProfile"] for the proto above

const jwtAuth = createJwtAuthInterceptor({
  jwksUri: 'https://auth.example.com/.well-known/jwks.json',
  skipMethods: publicMethods,
});

const authz = createProtoAuthzInterceptor({ defaultPolicy: 'deny' });
```

This keeps the single source of truth in `.proto` files -- mark a method as `public` once and both authn and authz respect it.

`getPublicMethods` reads Connectum options only. Standard gRPC Health and
Reflection protos carry no such annotations, so these services are not
automatically public. If you intentionally expose their RPCs without
credentials, add their exact service patterns to authentication `skipMethods`
and add unconditional allow rules to proto authz: `grpc.health.v1.Health/*`,
`grpc.reflection.v1.ServerReflection/*`, and
`grpc.reflection.v1alpha.ServerReflection/*`. The proto interceptor has no
`skipMethods` option. A server-level [request gate](/en/guide/security/request-admission)
is a separate check and must also admit those requests. HTTP health endpoints
are outside this RPC chain.

### Internal methods

An `internal` annotation does not authenticate a caller on its own. Skip these
methods in JWT authentication and install an internal interceptor before proto
authz. Its trust source must authenticate the calling service:

```typescript
import {
  createJwtAuthInterceptor, createInternalAuthInterceptor, createProtoAuthzInterceptor,
  getInternalMethods, getPublicMethods, meshIdentityTrust,
} from '@connectum/auth';
import { createDefaultInterceptors, createErrorHandlerInterceptor } from '@connectum/interceptors';

const descriptors = [UserService];
const internalMethods = getInternalMethods(descriptors);
const interceptors = [
  createErrorHandlerInterceptor(),
  createJwtAuthInterceptor({
    jwksUri: 'https://auth.example.com/.well-known/jwks.json',
    issuer: 'https://auth.example.com/',
    audience: 'my-api',
    skipMethods: [...getPublicMethods(descriptors), ...internalMethods],
  }),
  createInternalAuthInterceptor({
    internalMethods,
    trustSource: meshIdentityTrust({
      allowlist: [{
        principal: 'cluster.local/ns/default/sa/worker',
        roles: ['worker'],
      }],
    }),
  }),
  createProtoAuthzInterceptor({ defaultPolicy: 'deny' }),
  ...createDefaultInterceptors({ errorHandler: false }),
];
```

This example requires a mesh that authenticates the peer and overwrites
`x-forwarded-client-principal`; direct callers must not be able to supply it.
Without a mesh, use [`signedTokenTrust`](/en/api/@connectum/auth/functions/signedTokenTrust)
with per-issuer keys. `createProtoAuthzInterceptor` consumes the resulting
`AuthContext`; the upstream internal interceptor establishes the trust boundary.
See [ADR-029](/en/contributing/adr/029-internal-service-to-service-auth) for the
deployment requirements. Do not mark a method both public and internal.

## Resolution Details

### Hierarchical Merge

Service-level defaults are merged with method-level overrides:

| Setting | Method-level | Service-level | Default |
|---------|-------------|--------------|---------|
| `public` | `method_auth.public` | `service_auth.public` | `false` |
| `internal` | `method_auth.internal` | `service_auth.internal` | `false` |
| `requires` | `method_auth.requires` | `service_auth.default_requires` | none |
| `policy` | `method_auth.policy` | `service_auth.default_policy` | none |

### Caching

Resolved options are cached in a `WeakMap` keyed by method descriptor. After the first call per method, resolution is a single map lookup.

### Error Handling

| Scenario | Error |
|----------|-------|
| Unauthenticated + requires roles/scopes | `Code.Unauthenticated` |
| Authenticated but roles/scopes not met | `Code.PermissionDenied` via `AuthzDeniedError` |
| Interceptor default policy = deny, no match, authenticated | `Code.PermissionDenied` |
| Interceptor default policy = deny, no match, unauthenticated | `Code.Unauthenticated` |

`AuthzDeniedError` carries server-side details such as the rule name. Put
`createErrorHandlerInterceptor()` before authz so it converts this error through
the `SanitizableError` protocol and exposes only "Access denied". Without that
handler, the error's original message includes the rule name.

## Full Example

```typescript
import { createServer } from '@connectum/core';
import { createDefaultInterceptors, createErrorHandlerInterceptor } from '@connectum/interceptors';
import {
  createJwtAuthInterceptor,
  createProtoAuthzInterceptor,
  getPublicMethods,
} from '@connectum/auth';
import { UserService } from '#gen/user/v1/user_pb.ts';

const publicMethods = getPublicMethods([UserService]);

const jwtAuth = createJwtAuthInterceptor({
  jwksUri: 'https://auth.example.com/.well-known/jwks.json',
  issuer: 'https://auth.example.com/',
  audience: 'my-api',
  skipMethods: publicMethods,
});

const authz = createProtoAuthzInterceptor({
  defaultPolicy: 'deny',
  authorize: (ctx, req) => ctx.roles.includes('superadmin'),
});

const server = createServer({
  services: [userServiceRoutes],
  interceptors: [
    createErrorHandlerInterceptor(),
    jwtAuth,
    authz,
    ...createDefaultInterceptors({ errorHandler: false }),
  ],
});

await server.start();
```

## Related

- [Auth Overview](/en/guide/auth) -- all authentication strategies
- [Authorization (RBAC)](/en/guide/auth/authorization) -- declarative rules-based authorization
- [Auth Context](/en/guide/auth/context) -- accessing identity in handlers
- [@connectum/auth](/en/packages/auth) -- Package Guide
- [@connectum/auth API](/en/api/@connectum/auth/) -- Full API Reference
- [OpenAPI](/en/guide/openapi) -- publish a contract whose `security` reflects these options
- [ADR-024: Auth/Authz Strategy](/en/contributing/adr/024-auth-authz-strategy) -- design rationale
