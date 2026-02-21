---
outline: deep
---

# Auth Context

All authentication interceptors in `@connectum/auth` store the verified identity in `AuthContext` via `AsyncLocalStorage`. This makes the identity available to any code running within the request scope -- service handlers, other interceptors, and utility functions.

## Accessing Auth Context in Handlers

### Optional Access

Use `getAuthContext()` when authentication is optional (e.g. public endpoints that show extra data for logged-in users):

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
| `roles` | `string[]` | User roles |
| `scopes` | `string[]` | OAuth scopes or permissions |
| `claims` | `Record<string, unknown>` | Raw claims from the token or session |
| `type` | `string` | Auth type (`'jwt'`, `'gateway'`, `'session'`, `'custom'`) |

## Cross-Service Propagation

Enable `propagateHeaders` to forward auth context to downstream services via HTTP headers. This is useful in microservice architectures where the downstream service trusts the upstream caller:

```typescript
const jwtAuth = createJwtAuthInterceptor({
  jwksUri: '...',
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
| `x-auth-roles` | Comma-separated roles |
| `x-auth-scopes` | Comma-separated scopes |
| `x-auth-claims` | JSON-encoded filtered claims |

The downstream service can read these headers with `createGatewayAuthInterceptor`, completing the trust chain.

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

// Use with createJwtAuthInterceptor({ secret: TEST_JWT_SECRET })
```

### Full Test Example

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
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

  it('should reject unauthenticated requests', async () => {
    await assert.rejects(
      () => updateProfile({ name: 'Nope' }),
      (err) => err.code === 'UNAUTHENTICATED',
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
