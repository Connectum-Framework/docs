---
outline: deep
---

# Authorization

The `createAuthzInterceptor` enforces access control after authentication. It supports declarative rules, proto-based options, and a programmatic fallback callback.

## Declarative Rules

Define rules as an ordered list. The first matching rule wins:

```typescript
import { createAuthzInterceptor } from '@connectum/auth';

const authz = createAuthzInterceptor({
  defaultPolicy: 'deny',
  rules: [
    { name: 'public', methods: ['public.v1.PublicService/*'], effect: 'allow' },
    { name: 'admin-only', methods: ['admin.v1.AdminService/*'], requires: { roles: ['admin'] }, effect: 'allow' },
    { name: 'write-scope', methods: ['data.v1.DataService/Write*'], requires: { scopes: ['write'] }, effect: 'allow' },
  ],
});
```

### Rule Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Rule name for logging and debugging |
| `methods` | `string[]` | Method patterns (same syntax as `createMethodFilterInterceptor`) |
| `requires` | `{ roles?, scopes? }` | Required roles and/or scopes |
| `effect` | `'allow' \| 'deny'` | What to do when the rule matches |

### Matching Semantics

- **Roles** use **any-of** semantics -- the user needs at least one of the listed roles.
- **Scopes** use **all-of** semantics -- the user needs all listed scopes.
- Rules without `requires` match all authenticated users (or all requests, if the method is public).

### Method Patterns

| Pattern | Description |
|---------|-------------|
| `'public.v1.PublicService/*'` | All methods of the service |
| `'data.v1.DataService/Write*'` | Methods starting with `Write` |
| `'admin.v1.AdminService/DeleteUser'` | Exact method match |

## Programmatic Callback

For complex logic that can not be expressed as rules, add an `authorize` callback. It is invoked only when no rule matches:

```typescript
const authz = createAuthzInterceptor({
  defaultPolicy: 'deny',
  rules: [...],
  authorize: (context, req) => context.roles.includes('superadmin'),
});
```

If `authorize` returns `true`, the request is allowed. If it returns `false`, the `defaultPolicy` applies.

## Proto-Based Authorization

For defining authorization rules directly in `.proto` files using custom options, see the dedicated [Proto-Based Authorization](/en/guide/auth/proto-authz) page. Proto options are read at runtime by `createProtoAuthzInterceptor()` and take priority over programmatic rules.

## Interceptor Chain Position

Auth and authz interceptors must be placed **after** `errorHandler` and **before** resilience interceptors:

```
errorHandler -> AUTH -> AUTHZ -> timeout -> bulkhead -> circuitBreaker -> retry -> ...
```

This ensures:

- Authentication errors are properly formatted by `errorHandler`
- Unauthenticated requests are rejected before consuming resilience resources
- Auth context is available to all downstream interceptors

```typescript
const server = createServer({
  services: [routes],
  interceptors: [
    ...createDefaultInterceptors(),
    jwtAuth,   // after errorHandler chain
    authz,     // after authentication
  ],
});
```

## Full Example

```typescript
import { createServer } from '@connectum/core';
import { createDefaultInterceptors } from '@connectum/interceptors';
import { createJwtAuthInterceptor, createAuthzInterceptor } from '@connectum/auth';

const jwtAuth = createJwtAuthInterceptor({
  jwksUri: 'https://auth.example.com/.well-known/jwks.json',
  issuer: 'https://auth.example.com/',
});

const authz = createAuthzInterceptor({
  defaultPolicy: 'deny',
  rules: [
    { name: 'public', methods: ['public.v1.PublicService/*'], effect: 'allow' },
    { name: 'admin-only', methods: ['admin.v1.AdminService/*'], requires: { roles: ['admin'] }, effect: 'allow' },
    { name: 'write-scope', methods: ['data.v1.DataService/Write*'], requires: { scopes: ['write'] }, effect: 'allow' },
  ],
  authorize: (context, req) => {
    // Fallback: superadmins can do anything
    return context.roles.includes('superadmin');
  },
});

const server = createServer({
  services: [routes],
  interceptors: [...createDefaultInterceptors(), jwtAuth, authz],
});

await server.start();
```

## Related

- [Auth Overview](/en/guide/auth) -- all authentication strategies
- [JWT Authentication](/en/guide/auth/jwt) -- token verification
- [Proto-Based Authorization](/en/guide/auth/proto-authz) -- declarative authz via `.proto` options
- [Auth Context](/en/guide/auth/context) -- accessing identity in handlers
- [Method Filtering](/en/guide/interceptors/method-filtering) -- per-method interceptor routing
- [@connectum/auth](/en/packages/auth) -- Package Guide
- [@connectum/auth API](/en/api/@connectum/auth/) -- Full API Reference
- [ADR-024: Auth/Authz Strategy](/en/contributing/adr/024-auth-authz-strategy) -- design rationale
