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

### Streaming Handlers

The identity follows the whole call, not just the moment it was verified. A server-streaming or bidirectional handler is usually an `async function*`, and its code runs in pieces: before the first `yield`, after each `yield`, after every `await`, and in `finally`. Every one of those pieces sees the identity of the call it belongs to, over HTTP/2 and over the in-process `localClient()` alike:

```typescript
async function* watchOrders(req: WatchOrdersRequest) {
  const auth = requireAuthContext();       // the verified caller
  const cursor = await openCursor(auth.subject);
  try {
    for await (const order of cursor) {
      yield order;
      requireAuthContext();                // still the same caller after the consumer resumed us
    }
  } finally {
    await cursor.close({ owner: requireAuthContext().subject }); // runs after a cancel, a deadline or a server shutdown too
  }
}
```

A few details are worth knowing:

- The identity is scoped to the call, not to the process or the caller. When code calls a local client while holding its own identity, the handler sees the identity that was verified for *that* call, and the caller's own identity is unchanged after the call returns.
- Cleanup that is triggered by a cancellation, a deadline, or the server shutting down runs under the identity of the call it belongs to, even though the signal that triggered it comes from elsewhere.
- The identity scope replaces only the identity itself. Other `AsyncLocalStorage` values (a trace context, a tenant) are left as the surrounding code set them, so the in-process caller's own scopes stay visible to the handler.
- Leaving a consumer loop early with `break` is still not a cancellation: the handler stays suspended at its last `yield` until the call ends in another way, as it did before.
- A custom interceptor that opens an identity scope itself with `authContextStorage.run(context, () => next(req))` covers only the call that opens the stream. For streaming responses it must also scope every operation on the returned iterator (`next`, `return` and `throw`), as the built-in interceptors do.

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
| `expiresAt` | `Date \| undefined` | Credential expiration time, when available |

## Cross-Service Propagation

Enable `propagateHeaders` to forward auth context to downstream services via HTTP headers. This is useful in microservice architectures where the downstream service trusts the upstream caller:

```typescript
const jwtAuth = createJwtAuthInterceptor({
  jwksUri: '...',
  propagateHeaders: true,
});
```

To filter which claims are propagated in the `x-auth-claims` header, use the `propagatedClaims` option. It is available on `createAuthInterceptor` (generic) and `createSessionAuthInterceptor` -- not on `createJwtAuthInterceptor`:

```typescript
const sessionAuth = createSessionAuthInterceptor({
  verifySession: (token, headers) => auth.api.getSession({ headers }),
  mapSession: (session) => ({ /* ... */ }),
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

::: runtime bun
Import the runner from `bun:test` instead of `node:test` and run the file with `bun test`.
Everything else is identical -- `node:assert` works under Bun.
:::

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
