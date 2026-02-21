---
outline: deep
---

# Auth & Authz

The `@connectum/auth` package provides authentication interceptors and two authorization models: **proto-based** (rules in `.proto` files) and **code-based** (programmatic rules in TypeScript). Proto-based is the recommended approach -- it keeps access control alongside your API contract and requires zero application code changes when rules evolve.

## Quick Start

### Proto-Based Authorization (Recommended)

Define access rules directly in `.proto` files -- the interceptor reads them at runtime:

```protobuf
import "connectum/auth/v1/options.proto";

service UserService {
  option (connectum.auth.v1.service_auth) = { default_policy: "deny" };

  rpc GetProfile(GetProfileRequest) returns (GetProfileResponse) {
    option (connectum.auth.v1.method_auth) = { public: true };
  }

  rpc DeleteUser(DeleteUserRequest) returns (DeleteUserResponse) {
    option (connectum.auth.v1.method_auth) = { requires: { roles: ["admin"] } };
  }
}
```

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
  skipMethods: publicMethods, // synced from proto `public: true`
});

const authz = createProtoAuthzInterceptor({ defaultPolicy: 'deny' });

const server = createServer({
  services: [routes],
  interceptors: [...createDefaultInterceptors(), jwtAuth, authz],
});

await server.start();
```

### Code-Based Authorization

For services without proto annotations, use programmatic rules:

```typescript
import { createAuthzInterceptor } from '@connectum/auth';

const authz = createAuthzInterceptor({
  defaultPolicy: 'deny',
  rules: [
    { name: 'public', methods: ['public.v1.PublicService/*'], effect: 'allow' },
    { name: 'admin', methods: ['admin.v1.AdminService/*'], requires: { roles: ['admin'] }, effect: 'allow' },
  ],
});
```

Both approaches can be combined -- proto options take priority, programmatic rules act as fallback.

## Key Concepts

### Authorization: Proto vs Code

| | Proto-Based | Code-Based |
|-|-------------|------------|
| **Where rules live** | `.proto` files | TypeScript code |
| **Interceptor** | `createProtoAuthzInterceptor()` | `createAuthzInterceptor()` |
| **Change access rules** | Edit `.proto`, regenerate | Edit code, redeploy |
| **Single source of truth** | Proto contract = access policy | Separate from API contract |
| **Best for** | Most services (recommended) | Dynamic rules, legacy services |

### Authentication Strategies

| Factory | Credential source | Use case |
|---------|-------------------|----------|
| `createAuthInterceptor` | Any (pluggable callback) | API keys, mTLS, opaque tokens |
| `createJwtAuthInterceptor` | `Authorization: Bearer <JWT>` | Auth0, Keycloak, custom issuers |
| `createGatewayAuthInterceptor` | Gateway-injected headers | Kong, Envoy, Traefik pre-auth |
| `createSessionAuthInterceptor` | Session token (cookie or header) | better-auth, lucia, custom sessions |

All factories produce a standard ConnectRPC `Interceptor` and store the authenticated identity in `AuthContext` via `AsyncLocalStorage`.

### When Do You Need App-Level Auth?

| Scenario | Auth approach |
|----------|--------------|
| Services behind an API gateway that verifies tokens | Gateway auth (`createGatewayAuthInterceptor`) |
| Services exposed directly to clients | JWT auth (`createJwtAuthInterceptor`) |
| Services with session-based web clients | Session auth (`createSessionAuthInterceptor`) |
| Custom or exotic credential schemes | Generic auth (`createAuthInterceptor`) |

### Interceptor Chain Position

Auth interceptors must be placed **after** `errorHandler` and **before** resilience interceptors:

```
errorHandler -> AUTH -> AUTHZ -> timeout -> bulkhead -> circuitBreaker -> ...
```

## Learn More

- [JWT Authentication](/en/guide/auth/jwt) -- JWKS, HMAC, public key verification
- [Gateway Authentication](/en/guide/auth/gateway) -- pre-authenticated headers from API gateways
- [Session Authentication](/en/guide/auth/session) -- cookie-based and session-framework auth
- [Authorization (RBAC)](/en/guide/auth/authorization) -- declarative rules, programmatic callbacks
- [Proto-Based Authorization](/en/guide/auth/proto-authz) -- authz rules defined in `.proto` files
- [Auth Context](/en/guide/auth/context) -- accessing identity in handlers, cross-service propagation, testing
- [@connectum/auth](/en/packages/auth) -- Package Guide
- [@connectum/auth API](/en/api/@connectum/auth/) -- Full API Reference
- [ADR-024: Auth/Authz Strategy](/en/contributing/adr/024-auth-authz-strategy) -- design rationale
