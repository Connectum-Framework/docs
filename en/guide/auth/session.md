---
outline: deep
---

# Session Authentication

`createSessionAuthInterceptor` verifies session tokens using a pluggable `verifySession` callback. It is designed for frameworks like [better-auth](https://www.better-auth.com/), [lucia](https://lucia-auth.com/), or custom session stores.

## Configuration

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

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `verifySession` | `(token, headers) => Promise<Session>` | Yes | Validates the session token and returns session data |
| `mapSession` | `(session) => AuthContext` | Yes | Maps the session object to a standard `AuthContext` |
| `cache` | `{ ttl: number }` | No | Cache verified sessions to reduce backend calls |

## How It Works

Unlike `createJwtAuthInterceptor`, the session interceptor receives the **full request `Headers`** in its `verifySession` callback. This enables cookie-based auth flows where the session token is sent as a cookie rather than an `Authorization` header.

```
Request → extract token/cookies → verifySession(token, headers) → mapSession(session) → AuthContext
```

## Cookie-Based Auth

When your session framework reads cookies directly from headers:

```typescript
const sessionAuth = createSessionAuthInterceptor({
  verifySession: async (_token, headers) => {
    // The session framework reads the cookie from headers
    const session = await auth.api.getSession({ headers });
    if (!session) throw new Error('Invalid session');
    return session;
  },
  mapSession: (session) => ({
    subject: session.user.id,
    name: session.user.name,
    roles: session.user.roles ?? [],
    scopes: [],
    claims: session.user,
    type: 'session',
  }),
});
```

## Session Caching

Enable caching to avoid calling the session backend on every request:

```typescript
const sessionAuth = createSessionAuthInterceptor({
  verifySession: (token, headers) => auth.api.getSession({ headers }),
  mapSession: (session) => ({ /* ... */ }),
  cache: { ttl: 60_000 },  // Cache for 60 seconds
});
```

Cached sessions are keyed by the session token. When the TTL expires, the next request triggers a fresh `verifySession` call.

## Full Example

```typescript
import { createServer } from '@connectum/core';
import { createDefaultInterceptors } from '@connectum/interceptors';
import { createSessionAuthInterceptor, createAuthzInterceptor } from '@connectum/auth';

const sessionAuth = createSessionAuthInterceptor({
  verifySession: (token, headers) => auth.api.getSession({ headers }),
  mapSession: (session) => ({
    subject: session.user.id,
    name: session.user.name,
    roles: session.user.roles ?? [],
    scopes: [],
    claims: session.user,
    type: 'session',
  }),
  cache: { ttl: 60_000 },
});

const server = createServer({
  services: [routes],
  interceptors: [...createDefaultInterceptors(), sessionAuth],
});

await server.start();
```

## Related

- [Auth Overview](/en/guide/auth) -- all authentication strategies
- [JWT Authentication](/en/guide/auth/jwt) -- token-based authentication
- [Auth Context](/en/guide/auth/context) -- accessing identity in handlers
- [@connectum/auth](/en/packages/auth) -- Package Guide
- [@connectum/auth API](/en/api/@connectum/auth/) -- Full API Reference
