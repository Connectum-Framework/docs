---
title: Trust Gateway Authentication
description: Map identity headers from a trusted gateway into the request auth context.
docType: how-to
outline: deep
---

# Gateway Authentication

`createGatewayAuthInterceptor` reads pre-authenticated identity from headers injected by an API gateway (Kong, Envoy, Traefik, etc.). The gateway has already verified the token -- the service only needs to extract the identity.

## Configuration

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
    expectedValues: [process.env.GATEWAY_SECRET!],
  },
});
```

`headerMapping` describes how trusted gateway headers become an `AuthContext`.
`trustSource` checks a shared secret header before accepting the identity fields;
protect that marker from direct clients with TLS or network controls. See
[`GatewayAuthInterceptorOptions`](/en/api/@connectum/auth/interfaces/GatewayAuthInterceptorOptions)
for the exact nested fields.

### headerMapping

The `headerMapping` object maps `AuthContext` fields to the header names your gateway uses:

| Field | Expected header value | Example |
|-------|----------------------|---------|
| `subject` | User ID (string) | `x-user-id: user-123` |
| `name` | Display name (string) | `x-user-name: John Doe` |
| `roles` | JSON array or comma-separated roles | `x-user-roles: ["admin","editor"]` or `x-user-roles: admin,editor` |
| `scopes` | Space-separated scopes | `x-user-scopes: read write` |

### trustSource Check

The `trustSource` check verifies that the request actually came from a trusted gateway, not a direct client spoofing headers:

```typescript
trustSource: {
  header: 'x-gateway-secret',
  expectedValues: [process.env.GATEWAY_SECRET!],
}
```

If the header is missing or the value does not match any of the `expectedValues`, the interceptor throws `Unauthenticated`.

## Header Stripping

Mapped headers and the trust header are **always stripped** from the request after extraction. This prevents downstream services or handlers from seeing (and potentially trusting) these headers if the request is forwarded.

## Full Example

```typescript
import { createServer } from '@connectum/core';
import { createDefaultInterceptors, createErrorHandlerInterceptor } from '@connectum/interceptors';
import { createGatewayAuthInterceptor, createAuthzInterceptor } from '@connectum/auth';

const gatewayAuth = createGatewayAuthInterceptor({
  headerMapping: {
    subject: 'x-user-id',
    name: 'x-user-name',
    roles: 'x-user-roles',
  },
  trustSource: {
    header: 'x-gateway-secret',
    expectedValues: [process.env.GATEWAY_SECRET!],
  },
});

const authz = createAuthzInterceptor({
  defaultPolicy: 'deny',
  rules: [
    { name: 'admin', methods: ['admin.v1.AdminService/*'], requires: { roles: ['admin'] }, effect: 'allow' },
  ],
});

const server = createServer({
  services: [routes],
  interceptors: [
    createErrorHandlerInterceptor(),
    gatewayAuth,
    authz,
    ...createDefaultInterceptors({ errorHandler: false }),
  ],
});

await server.start();
```

## Related

- [Auth Overview](/en/guide/auth) -- all authentication strategies
- [JWT Authentication](/en/guide/auth/jwt) -- direct token verification
- [Auth Context](/en/guide/auth/context) -- accessing identity in handlers
- [@connectum/auth](/en/packages/auth) -- Package Guide
- [@connectum/auth API](/en/api/@connectum/auth/) -- Full API Reference
