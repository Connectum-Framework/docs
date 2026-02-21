---
outline: deep
---

# Proto-Based Authorization

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

  // Public endpoint -- skip authentication and authorization
  rpc GetProfile(GetProfileRequest) returns (GetProfileResponse) {
    option (connectum.auth.v1.method_auth) = { public: true };
  }

  // Requires "admin" role
  rpc DeleteUser(DeleteUserRequest) returns (DeleteUserResponse) {
    option (connectum.auth.v1.method_auth) = {
      requires: { roles: ["admin"] }
    };
  }

  // Requires both "users:write" scope
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
| `default_policy` | `string` | `"allow"` or `"deny"` when no rule matches |
| `default_requires` | `AuthRequirements` | Default roles/scopes for all methods |
| `public` | `bool` | Mark all methods as public (skip authn + authz) |

#### `method_auth` (method-level)

| Field | Type | Description |
|-------|------|-------------|
| `public` | `bool` | Skip authentication and authorization |
| `requires` | `AuthRequirements` | Required roles and/or scopes |
| `policy` | `string` | Override service-level default policy |

#### `AuthRequirements`

| Field | Type | Semantics |
|-------|------|-----------|
| `roles` | `repeated string` | **any-of** -- user needs at least one |
| `scopes` | `repeated string` | **all-of** -- user needs every scope |

Method-level options always override service-level defaults.

## Interceptor Setup

```typescript
import { createProtoAuthzInterceptor } from '@connectum/auth';

const authz = createProtoAuthzInterceptor();
```

That's it -- the interceptor reads proto options at runtime. No explicit rules needed.

### With Fallback Rules

Combine proto options with programmatic rules for methods without proto annotations:

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

The interceptor resolves authorization in this priority:

```
1. Proto `public` option       → allow (skip authn + authz)
2. Check auth context exists   → reject if unauthenticated
3. Proto `requires` option     → check roles/scopes
4. Proto `policy`              → apply "allow" or "deny"
5. Programmatic rules          → evaluate in order
6. `authorize` callback        → custom logic
7. `defaultPolicy`             → final fallback (default: "deny")
```

Proto options take priority over programmatic rules. This means you can define fine-grained access in `.proto` files and use programmatic rules as a safety net.

## Syncing Public Methods with Authentication

Use `getPublicMethods()` to extract public method patterns from proto options and pass them to your authentication interceptor's `skipMethods`:

```typescript
import { createJwtAuthInterceptor, createProtoAuthzInterceptor, getPublicMethods } from '@connectum/auth';
import { UserService } from '#gen/user_pb.js';
import { HealthService } from '#gen/health_pb.js';

const publicMethods = getPublicMethods([UserService, HealthService]);
// ["user.v1.UserService/GetProfile", "grpc.health.v1.Health/Check"]

const jwtAuth = createJwtAuthInterceptor({
  jwksUri: 'https://auth.example.com/.well-known/jwks.json',
  skipMethods: [
    ...publicMethods,
    'grpc.reflection.v1.ServerReflection/*',
  ],
});

const authz = createProtoAuthzInterceptor({ defaultPolicy: 'deny' });
```

This keeps the single source of truth in `.proto` files -- mark a method as `public` once and both authn and authz respect it.

## Resolution Details

### Hierarchical Merge

Service-level defaults are merged with method-level overrides:

| Setting | Method-level | Service-level | Default |
|---------|-------------|--------------|---------|
| `public` | `method_auth.public` | `service_auth.public` | `false` |
| `requires` | `method_auth.requires` | `service_auth.default_requires` | none |
| `policy` | `method_auth.policy` | `service_auth.default_policy` | none |

### Caching

Resolved options are cached in a `WeakMap` keyed by method descriptor. After the first call per method, resolution is a single map lookup.

### Error Handling

| Scenario | Error |
|----------|-------|
| Unauthenticated + requires roles/scopes | `Code.Unauthenticated` |
| Authenticated but roles/scopes not met | `Code.PermissionDenied` via `AuthzDeniedError` |
| Default policy = deny, no match | `Code.PermissionDenied` |

`AuthzDeniedError` carries server-side details (rule name, required roles/scopes) while exposing only "Access denied" to clients via the `SanitizableError` protocol.

## Full Example

```typescript
import { createServer } from '@connectum/core';
import { createDefaultInterceptors } from '@connectum/interceptors';
import {
  createJwtAuthInterceptor,
  createProtoAuthzInterceptor,
  getPublicMethods,
} from '@connectum/auth';
import { UserService } from '#gen/user_pb.js';

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
  interceptors: [...createDefaultInterceptors(), jwtAuth, authz],
});

await server.start();
```

## Related

- [Auth Overview](/en/guide/auth) -- all authentication strategies
- [Authorization (RBAC)](/en/guide/auth/authorization) -- declarative rules-based authorization
- [Auth Context](/en/guide/auth/context) -- accessing identity in handlers
- [@connectum/auth](/en/packages/auth) -- Package Guide
- [@connectum/auth API](/en/api/@connectum/auth/) -- Full API Reference
- [ADR-024: Auth/Authz Strategy](/en/contributing/adr/024-auth-authz-strategy) -- design rationale
