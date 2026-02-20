---
title: Auth & Authz
description: Authentication and authorization guide for Connectum services.
outline: deep
---

# Auth & Authz

The `@connectum/auth` package provides interceptor factories for authentication and declarative authorization. It covers the most common patterns: JWT, gateway-injected headers, session-based auth, and RBAC rules.

## When Do You Need App-Level Auth?

| Scenario | Auth approach |
|----------|--------------|
| Services behind an API gateway that verifies tokens | Gateway auth (`createGatewayAuthInterceptor`) |
| Services exposed directly to clients | JWT auth (`createJwtAuthInterceptor`) |
| Services with session-based web clients | Session auth (`createSessionAuthInterceptor`) |
| Custom or exotic credential schemes | Generic auth (`createAuthInterceptor`) |

If your gateway already authenticates requests, you only need to read the pre-authenticated identity from headers. If services are exposed directly, you need full token verification.

## Quick Start

Install the package:

```bash
pnpm add @connectum/auth
```

Minimal JWT authentication with RBAC authorization:

```typescript
import { createServer } from '@connectum/core';
import { createDefaultInterceptors } from '@connectum/interceptors';
import { createJwtAuthInterceptor, createAuthzInterceptor } from '@connectum/auth';

const jwtAuth = createJwtAuthInterceptor({
  jwksUri: 'https://auth.example.com/.well-known/jwks.json',
  issuer: 'https://auth.example.com/',
  audience: 'my-api',
});

const authz = createAuthzInterceptor({
  defaultPolicy: 'deny',
  rules: [
    { name: 'public', methods: ['public.v1.PublicService/*'], effect: 'allow' },
    { name: 'admin', methods: ['admin.v1.AdminService/*'], requires: { roles: ['admin'] }, effect: 'allow' },
  ],
});

const server = createServer({
  services: [routes],
  interceptors: [
    ...createDefaultInterceptors(),
    jwtAuth,
    authz,
  ],
});

await server.start();
```

## Authentication Strategies

| Factory | Credential source | Use case |
|---------|-------------------|----------|
| `createAuthInterceptor` | Any (pluggable `verifyCredentials` callback) | API keys, mTLS, opaque tokens |
| `createJwtAuthInterceptor` | `Authorization: Bearer <JWT>` | Auth0, Keycloak, custom JWT issuers |
| `createGatewayAuthInterceptor` | Gateway-injected headers (`x-user-id`, etc.) | Kong, Envoy, Traefik pre-auth |
| `createSessionAuthInterceptor` | Session token (cookie or header) | better-auth, lucia, custom sessions |

All factories produce a standard ConnectRPC `Interceptor` and store the authenticated identity in `AuthContext` via `AsyncLocalStorage`.

## JWT Authentication

### JWKS (recommended for production)

```typescript
import { createJwtAuthInterceptor } from '@connectum/auth';

const jwtAuth = createJwtAuthInterceptor({
  jwksUri: 'https://auth.example.com/.well-known/jwks.json',
  issuer: 'https://auth.example.com/',
  audience: 'my-api',
  maxTokenAge: '1h',
  claimsMapping: {
    roles: 'realm_access.roles',
    scopes: 'scope',
  },
});
```

### HMAC Secret (simple setups, testing)

```typescript
const jwtAuth = createJwtAuthInterceptor({
  secret: process.env.JWT_SECRET,
  issuer: 'my-service',
});
```

### Public Key

```typescript
const publicKey = await crypto.subtle.importKey(
  'spki', keyData, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, true, ['verify'],
);

const jwtAuth = createJwtAuthInterceptor({ publicKey });
```

Key resolution priority: `jwksUri` > `publicKey` > `secret`. At least one must be provided.

## Gateway Authentication

For services behind an API gateway that has already verified the token:

```typescript
import { createGatewayAuthInterceptor } from '@connectum/auth';

const gatewayAuth = createGatewayAuthInterceptor({
  headerMapping: {
    subject: 'x-user-id',
    name: 'x-user-name',
    roles: 'x-user-roles',
  },
  trustSource: {
    header: 'x-gateway-secret',
    expectedValues: [process.env.GATEWAY_SECRET],
  },
});
```

The `trustSource` check verifies the request came from a trusted gateway. Mapped headers and the trust header are **always stripped** to prevent downstream spoofing.

## Session Authentication

For frameworks like better-auth or lucia:

```typescript
import { createSessionAuthInterceptor } from '@connectum/auth';

const sessionAuth = createSessionAuthInterceptor({
  verifySession: (token, headers) => auth.api.getSession({ headers }),
  mapSession: (session) => ({
    subject: session.user.id,
    name: session.user.name,
    roles: [],
    scopes: [],
    claims: session.user,
    type: 'session',
  }),
  cache: { ttl: 60_000 },
});
```

Unlike other factories, `verifySession` receives the full request `Headers`, enabling cookie-based auth flows.

## Authorization

### Declarative Rules

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

Rules are evaluated in order; the first matching rule wins. **Roles** use any-of semantics (user needs at least one). **Scopes** use all-of semantics (user needs all listed scopes).

### Programmatic Callback

For complex logic that can't be expressed as rules:

```typescript
const authz = createAuthzInterceptor({
  defaultPolicy: 'deny',
  rules: [...],
  authorize: (context, req) => context.roles.includes('superadmin'),
});
```

The callback is invoked only when no rule matches.

## Proto-Based Authorization

Define authorization rules directly in `.proto` files using custom options:

```protobuf
import "connectum/auth/v1/options.proto";

service UserService {
  option (connectum.auth.v1.service_auth) = {
    default_policy: "deny"
  };

  rpc GetProfile(GetProfileRequest) returns (GetProfileResponse) {
    option (connectum.auth.v1.method_auth) = { public: true };
  }

  rpc UpdateProfile(UpdateProfileRequest) returns (UpdateProfileResponse) {
    option (connectum.auth.v1.method_auth) = {
      requires: { roles: ["admin"] }
    };
  }
}
```

Use `createProtoAuthzInterceptor()` to read these options at runtime:

```typescript
import { createProtoAuthzInterceptor } from '@connectum/auth';

const authz = createProtoAuthzInterceptor({
  defaultPolicy: 'deny',
});
```

**Decision flow**: proto `public` → check auth context → proto `requires` → proto `policy` → programmatic rules → callback → `defaultPolicy`.

## Interceptor Chain Position

Auth interceptors must be placed **after** `errorHandler` and **before** resilience interceptors:

```
errorHandler → AUTH → AUTHZ → timeout → bulkhead → circuitBreaker → retry → ...
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

## Context Propagation

### Accessing Auth Context in Handlers

All auth interceptors store the authenticated identity in `AsyncLocalStorage`:

```typescript
import { getAuthContext, requireAuthContext } from '@connectum/auth';

// Optional access (returns undefined if not authenticated)
const auth = getAuthContext();

// Required access (throws Unauthenticated if missing)
const auth = requireAuthContext();
console.log(`User: ${auth.subject}, roles: ${auth.roles}`);
```

### Cross-Service Propagation

Enable `propagateHeaders` to forward auth context to downstream services via HTTP headers:

```typescript
const jwtAuth = createJwtAuthInterceptor({
  jwksUri: '...',
  propagateHeaders: true,
  propagatedClaims: ['email', 'org_id'], // optional: filter sensitive claims
});
```

Headers used: `x-auth-subject`, `x-auth-type`, `x-auth-name`, `x-auth-roles`, `x-auth-scopes`, `x-auth-claims`.

## Testing

The `@connectum/auth/testing` subpath export provides helpers:

```typescript
import { createMockAuthContext, createTestJwt, withAuthContext, TEST_JWT_SECRET } from '@connectum/auth/testing';

// Run handler with a mock auth context
const result = await withAuthContext(
  createMockAuthContext({ subject: 'user-1', roles: ['admin'] }),
  () => myHandler(request),
);

// Generate a signed JWT for integration tests
const token = await createTestJwt({ sub: 'user-1', roles: ['admin'] });
```

## Next Steps

- [@connectum/auth API Reference](/en/packages/auth) -- full API documentation
- [ADR-024: Auth/Authz Strategy](/en/contributing/adr/024-auth-authz-strategy) -- design rationale
- [Auth Example](https://github.com/Connectum-Framework/examples/tree/main/auth) -- complete working example
