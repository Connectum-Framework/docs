---
title: Read the Auth Context
description: Access the authenticated identity within a request scope.
docType: how-to
outline: deep
---

# Auth Context

All authentication interceptors in `@connectum/auth` store the verified identity in `AuthContext` via `AsyncLocalStorage`. This makes the identity available to any code running within the request scope -- service handlers, other interceptors, and utility functions.

## Accessing Auth Context in Handlers

### Optional Access

Use `getAuthContext()` when the handler can work without an identity. This helper
only reads the current scope; it does not verify credentials. A method skipped by
the authentication interceptor does not gain an identity merely because a token
is present:

```typescript
import { getAuthContext } from '@connectum/auth';

function getProduct(req: GetProductRequest) {
  const auth = getAuthContext(); // undefined if not authenticated

  if (auth) {
    // Show personalized pricing for logged-in users
    return getProductWithPricing(req, auth.subject);
  }

  return getPublicProduct(req);
}
```

### Required Access

Use `requireAuthContext()` when the handler requires authentication. It throws `Unauthenticated` if no auth context exists:

```typescript
import { requireAuthContext } from '@connectum/auth';

function updateProfile(req: UpdateProfileRequest) {
  const auth = requireAuthContext(); // throws if not authenticated

  console.log(`User: ${auth.subject}, roles: ${auth.roles}`);
  // ...
}
```

### AuthContext Shape

The `AuthContext` object contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `subject` | `string` | User identifier (from JWT `sub`, gateway header, or session) |
| `name` | `string \| undefined` | Display name |
| `roles` | `readonly string[]` | User roles |
| `scopes` | `readonly string[]` | OAuth scopes or permissions |
| `claims` | `Readonly<Record<string, unknown>>` | Raw claims from the token or session |
| `type` | `string` | Credential type chosen by the verifier; not a closed enumeration |
| `expiresAt` | `Date \| undefined` | Credential expiration time, when available |

## Cross-Service Propagation

Enable the authentication interceptor's `propagateHeaders` to write the verified
identity into the current request's headers. It does not send a downstream
request itself. To carry those fields on `ctx.call` or `ctx.stream`, also list the
chosen headers in the server's [header propagation](/en/guide/service-communication/service-catalog#header-propagation)
configuration; independent clients need an outgoing interceptor.

```typescript
const jwtAuth = createJwtAuthInterceptor({
  jwksUri: '...',
  propagateHeaders: true,
});
```

To filter which claims are written into `x-auth-claims`, use `propagatedClaims` on
`createAuthInterceptor` (generic) or `createSessionAuthInterceptor`. It is not an
option of `createJwtAuthInterceptor` or `createGatewayAuthInterceptor`; enabling
their propagation writes all claims that fit the header limit. The session
snippet uses the validated `mapSession` helper from the [session guide](/en/guide/auth/session):

```typescript
const sessionAuth = createSessionAuthInterceptor({
  verifySession: verifySessionToken,
  mapSession,
  propagateHeaders: true,
  propagatedClaims: ['email', 'org_id'], // optional: filter sensitive claims
});
```

### Propagated Headers

| Header | Content |
|--------|---------|
| `x-auth-subject` | User ID |
| `x-auth-type` | Auth type |
| `x-auth-name` | Display name |
| `x-auth-roles` | JSON-encoded roles array |
| `x-auth-scopes` | Space-separated scopes |
| `x-auth-claims` | JSON-encoded filtered claims |

`createGatewayAuthInterceptor` can map these identity headers, but it still
requires its configured `trustSource` marker. Forwarded identity headers alone
do not establish caller trust; see [client auth interceptors](/en/guide/auth/client-interceptors)
for a client that attaches the gateway marker.

## Testing

The `@connectum/auth/testing` subpath export provides helpers for unit and integration tests.

### Mock Auth Context

Run a handler with a mock auth context:

```typescript
import { createMockAuthContext, withAuthContext } from '@connectum/auth/testing';

const result = await withAuthContext(
  createMockAuthContext({ subject: 'user-1', roles: ['admin'] }),
  () => myHandler(request),
);
```

### Test JWT

Generate a signed JWT for integration tests:

```typescript
import { createTestJwt, TEST_JWT_SECRET } from '@connectum/auth/testing';

const token = await createTestJwt({ sub: 'user-1', roles: ['admin'] });

// Map the roles claim explicitly when verifying this token.
// createJwtAuthInterceptor({ secret: TEST_JWT_SECRET, claimsMapping: { roles: 'roles' } })
```

### Full Test Example

::: runtime bun
Import the runner from `bun:test` instead of `node:test` and run the file with `bun test`.
Everything else is identical -- `node:assert` works under Bun.
:::

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Code, ConnectError } from '@connectrpc/connect';
import { createMockAuthContext, withAuthContext } from '@connectum/auth/testing';

describe('updateProfile', () => {
  it('should update the profile for an authenticated user', async () => {
    const auth = createMockAuthContext({
      subject: 'user-42',
      name: 'Alice',
      roles: ['user'],
    });

    const result = await withAuthContext(auth, () =>
      updateProfile({ name: 'Alice Updated' }),
    );

    assert.strictEqual(result.name, 'Alice Updated');
  });

  it('should reject unauthenticated requests', () => {
    assert.throws(
      () => updateProfile({ name: 'Nope' }),
      (err: unknown) => err instanceof ConnectError && err.code === Code.Unauthenticated,
    );
  });
});
```

## Related

- [Auth Overview](/en/guide/auth) -- all authentication strategies
- [JWT Authentication](/en/guide/auth/jwt) -- token verification
- [Gateway Authentication](/en/guide/auth/gateway) -- header-based auth
- [Authorization](/en/guide/auth/authorization) -- RBAC and access control
- [@connectum/auth](/en/packages/auth) -- Package Guide
- [@connectum/auth API](/en/api/@connectum/auth/) -- Full API Reference
