---
title: '@connectum/auth'
description: Authentication and authorization interceptors for Connectum
---

# @connectum/auth

Authentication and authorization interceptors for ConnectRPC services. Provides interceptor factories covering the most common auth patterns: generic pluggable auth, JWT (via jose), gateway-injected headers, session-based auth, and declarative authorization rules. All interceptors propagate `AuthContext` through `AsyncLocalStorage` so handlers can access the authenticated identity without explicit parameter passing.

**Layer**: 1 (Protocol)

## Installation

```bash
pnpm add @connectum/auth
```

**Requires**: Node.js 18+

**Dependencies**: `@connectrpc/connect`, `@connectum/core`, `jose`

## Quick Start

```typescript
import { createServer } from '@connectum/core';
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
  interceptors: [jwtAuth, authz],
});

await server.start();
```

Access the authenticated identity in handlers:

```typescript
import { requireAuthContext } from '@connectum/auth';

const handler = {
  async getUser(req) {
    const auth = requireAuthContext(); // throws Unauthenticated if missing
    return { user: await db.getUser(auth.subject) };
  },
};
```

## Auth Context

All authentication interceptors produce an `AuthContext` and store it in `AsyncLocalStorage`. Downstream interceptors and handlers access it via `getAuthContext()` or `requireAuthContext()`.

```typescript
interface AuthContext {
  readonly subject: string;                        // User/service identifier
  readonly name?: string;                          // Human-readable display name
  readonly roles: ReadonlyArray<string>;           // Assigned roles
  readonly scopes: ReadonlyArray<string>;          // Granted scopes
  readonly claims: Readonly<Record<string, unknown>>; // Raw credential claims
  readonly type: string;                           // Credential type ("jwt", "api-key", etc.)
  readonly expiresAt?: Date;                       // Credential expiration
}
```

## API Reference

### `createAuthInterceptor(options)`

Generic, pluggable authentication interceptor. Extracts credentials from the request, verifies them via a user-provided callback, and stores the resulting `AuthContext` in `AsyncLocalStorage`.

```typescript
function createAuthInterceptor(options: AuthInterceptorOptions): Interceptor;
```

By default, extracts a Bearer token from the `Authorization` header. Override `extractCredentials` for custom extraction (API keys, custom headers, etc.).

```typescript
import { createAuthInterceptor } from '@connectum/auth';

const auth = createAuthInterceptor({
  verifyCredentials: async (token) => {
    const user = await db.findByToken(token);
    if (!user) throw new Error('Invalid token');
    return {
      subject: user.id,
      roles: user.roles,
      scopes: [],
      claims: {},
      type: 'api-key',
    };
  },
  cache: { ttl: 60_000, maxSize: 500 },
});
```

#### `AuthInterceptorOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `verifyCredentials` | `(credentials: string) => AuthContext \| Promise<AuthContext>` | **(required)** | Verify credentials and return auth context. Must throw on invalid credentials. |
| `extractCredentials` | `(req: { header: Headers }) => string \| null \| Promise<string \| null>` | Bearer token extractor | Extract credentials from request headers |
| `skipMethods` | `string[]` | `[]` | Method patterns to skip authentication for |
| `propagateHeaders` | `boolean` | `false` | Propagate auth context as headers for downstream services |
| `cache` | `CacheOptions` | `undefined` | LRU cache for verification results |
| `propagatedClaims` | `string[]` | `undefined` | Filter which claim keys are propagated in headers (all if undefined) |

---

### `createJwtAuthInterceptor(options)`

JWT convenience wrapper built on [jose](https://github.com/panva/jose). Supports JWKS remote key sets, HMAC secrets, and asymmetric public keys. Delegates to `createAuthInterceptor` internally.

```typescript
function createJwtAuthInterceptor(options: JwtAuthInterceptorOptions): Interceptor;
```

Key resolution priority: `jwksUri` > `secret` > `publicKey`. At least one must be provided.

```typescript
import { createJwtAuthInterceptor } from '@connectum/auth';

// JWKS-based (Auth0, Keycloak, etc.)
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

// HMAC secret (testing / simple setups)
const jwtAuth = createJwtAuthInterceptor({
  secret: process.env.JWT_SECRET,
  issuer: 'my-service',
});
```

**SEC-002**: Throws `ConnectError(Code.Unauthenticated)` when the JWT is missing a subject claim. No silent fallback.

#### `JwtAuthInterceptorOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `jwksUri` | `string` | -- | JWKS endpoint URL for remote key set |
| `secret` | `string` | -- | HMAC symmetric secret (HS256/HS384/HS512). Minimum key size enforced per RFC 7518. |
| `publicKey` | `CryptoKey` | -- | Asymmetric public key |
| `issuer` | `string \| string[]` | -- | Expected token issuer(s) |
| `audience` | `string \| string[]` | -- | Expected token audience(s) |
| `algorithms` | `string[]` | -- | Allowed algorithms |
| `maxTokenAge` | `number \| string` | -- | Maximum token age (seconds or duration string, e.g., `"2h"`) |
| `claimsMapping` | `{ subject?, name?, roles?, scopes? }` | `{}` | Maps JWT claims to AuthContext fields. Supports dot-notation paths (e.g., `"realm_access.roles"`). |
| `skipMethods` | `string[]` | `[]` | Method patterns to skip authentication for |
| `propagateHeaders` | `boolean` | `false` | Propagate auth context as headers for downstream services |

---

### `createGatewayAuthInterceptor(options)`

For services behind an API gateway (Kong, Envoy, Traefik, etc.) that has already performed authentication. Reads pre-authenticated identity from gateway-injected headers after verifying the request source.

Trust is established via a header value check (shared secret or CIDR-based IP matching), not via `peerAddress`.

```typescript
function createGatewayAuthInterceptor(options: GatewayAuthInterceptorOptions): Interceptor;
```

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

Mapped headers and the trust header are **always stripped** -- including for methods listed in `skipMethods` -- to prevent downstream spoofing even on public endpoints.

#### `GatewayAuthInterceptorOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `headerMapping` | `GatewayHeaderMapping` | **(required)** | Maps gateway headers to AuthContext fields. `subject` is required. |
| `trustSource` | `{ header: string; expectedValues: string[] }` | **(required)** | Trust verification. Supports exact match and CIDR notation (e.g., `"10.0.0.0/8"`). |
| `stripHeaders` | `string[]` | `[]` | Additional headers to strip after extraction |
| `skipMethods` | `string[]` | `[]` | Method patterns to skip authentication for |
| `propagateHeaders` | `boolean` | `false` | Propagate auth context as headers for downstream services |
| `defaultType` | `string` | `"gateway"` | Default credential type when not provided by gateway |

#### `GatewayHeaderMapping`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `subject` | `string` | Yes | Header containing the authenticated subject |
| `name` | `string` | No | Header containing the display name |
| `roles` | `string` | No | Header containing roles (JSON array or comma-separated) |
| `scopes` | `string` | No | Header containing scopes (space-separated) |
| `type` | `string` | No | Header containing credential type |
| `claims` | `string` | No | Header containing JSON-encoded claims |

---

### `createSessionAuthInterceptor(options)`

Session-based authentication for frameworks like better-auth, lucia, etc. Two-step process: verify the session token, then map raw session data to `AuthContext`.

Unlike `createAuthInterceptor`, this interceptor passes the **full request `Headers`** to `verifySession`, enabling cookie-based auth flows.

```typescript
function createSessionAuthInterceptor(options: SessionAuthInterceptorOptions): Interceptor;
```

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

#### `SessionAuthInterceptorOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `verifySession` | `(token: string, headers: Headers) => unknown \| Promise<unknown>` | **(required)** | Verify session token and return raw session data. Must throw on invalid sessions. |
| `mapSession` | `(session: unknown) => AuthContext \| Promise<AuthContext>` | **(required)** | Map raw session data to AuthContext |
| `extractToken` | `(req: { header: Headers }) => string \| null \| Promise<string \| null>` | Bearer token extractor | Custom token extraction |
| `cache` | `CacheOptions` | `undefined` | LRU cache for session verification results |
| `skipMethods` | `string[]` | `[]` | Method patterns to skip authentication for |
| `propagateHeaders` | `boolean` | `false` | Propagate auth context as headers for downstream services |
| `propagatedClaims` | `string[]` | `undefined` | Filter which claim keys are propagated in headers (all if undefined) |

---

### `createAuthzInterceptor(options?)`

Declarative rules-based authorization interceptor. Evaluates rules against `AuthContext` from the authentication interceptor. Must be placed **after** an auth interceptor in the chain.

```typescript
function createAuthzInterceptor(options?: AuthzInterceptorOptions): Interceptor;
```

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

Rules are evaluated in order; the first matching rule wins. If no rule matches, the optional `authorize` callback is invoked. If neither rules nor callback produce a decision, `defaultPolicy` applies.

- **Roles**: user must have **at least one** of the required roles
- **Scopes**: user must have **all** required scopes

#### `AuthzInterceptorOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultPolicy` | `AuthzEffect` | `"deny"` | Policy when no rule matches and no callback is defined |
| `rules` | `AuthzRule[]` | `[]` | Declarative authorization rules, evaluated in order |
| `authorize` | `(context: AuthContext, req: { service, method }) => boolean \| Promise<boolean>` | -- | Programmatic authorization callback (fallback after rules) |
| `skipMethods` | `string[]` | `[]` | Method patterns to skip authorization for |

#### `AuthzRule`

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Rule name for logging and debugging |
| `methods` | `string[]` | Method patterns to match |
| `effect` | `AuthzEffect` | `"allow"` or `"deny"` |
| `requires` | `{ roles?: string[]; scopes?: string[] }` | Required roles/scopes for the rule to apply |

## Context Utilities

### `authContextStorage`

The `AsyncLocalStorage<AuthContext>` instance used by all auth interceptors. Automatically isolated per async context (request).

### `getAuthContext()`

Returns the current `AuthContext` or `undefined` if no auth interceptor is active.

```typescript
import { getAuthContext } from '@connectum/auth';

const auth = getAuthContext();
if (auth) {
  console.log(`Authenticated as ${auth.subject}`);
}
```

### `requireAuthContext()`

Returns the current `AuthContext` or throws `ConnectError(Code.Unauthenticated)`. Use when authentication is mandatory.

```typescript
import { requireAuthContext } from '@connectum/auth';

const auth = requireAuthContext(); // throws if not authenticated
```

## Header Utilities

Serialization and deserialization of `AuthContext` to/from HTTP headers for cross-service context propagation.

### `setAuthHeaders(headers, context, propagatedClaims?)`

Serialize `AuthContext` to request headers. Used internally by auth interceptors when `propagateHeaders` is enabled.

Headers for `roles`, `scopes`, and `claims` are **silently dropped** if the serialized value exceeds 8192 bytes. This prevents oversized headers from causing transport-level failures.

```typescript
import { setAuthHeaders } from '@connectum/auth';

setAuthHeaders(req.header, authContext);
// With claims filter:
setAuthHeaders(req.header, authContext, ['email', 'org_id']);
```

### `parseAuthHeaders(headers)`

Deserialize `AuthContext` from request headers. Returns `undefined` if the required `x-auth-subject` header is missing.

Only use in trusted environments (behind mTLS, service mesh, etc.).

```typescript
import { parseAuthHeaders } from '@connectum/auth';

const context = parseAuthHeaders(req.header);
```

### `AUTH_HEADERS`

Standard header names used for auth context propagation:

| Constant | Header Name | Description |
|----------|-------------|-------------|
| `SUBJECT` | `x-auth-subject` | Authenticated subject identifier |
| `TYPE` | `x-auth-type` | Credential type |
| `NAME` | `x-auth-name` | Display name |
| `ROLES` | `x-auth-roles` | JSON-encoded roles array |
| `SCOPES` | `x-auth-scopes` | Space-separated scopes |
| `CLAIMS` | `x-auth-claims` | JSON-encoded claims object |

## Cache

### `LruCache<T>`

Minimal in-memory LRU cache with TTL expiration. Uses `Map` insertion order for LRU eviction. No external dependencies.

The constructor throws `RangeError("ttl must be a positive number")` if `ttl` is zero or negative.

```typescript
import { LruCache } from '@connectum/auth';

const cache = new LruCache<string>({ ttl: 60_000, maxSize: 500 });
cache.set('key', 'value');
const value = cache.get('key'); // undefined after TTL
cache.clear();
cache.size; // number of entries
```

### `CacheOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ttl` | `number` | **(required)** | Entry time-to-live in milliseconds. Must be a positive number. |
| `maxSize` | `number` | `1000` | Maximum number of cached entries |

## Errors

### `AuthzDeniedError`

Extends `ConnectError` with `Code.PermissionDenied`. Carries server-side details (rule name, required roles/scopes) while exposing only "Access denied" to the client via the `SanitizableError` protocol from `@connectum/core`.

```typescript
import { AuthzDeniedError } from '@connectum/auth';
```

| Property | Type | Description |
|----------|------|-------------|
| `clientMessage` | `string` | Always `"Access denied"` (safe for clients) |
| `ruleName` | `string` | Name of the rule that denied access |
| `authzDetails` | `AuthzDeniedDetails` | Full details including required roles/scopes |
| `serverDetails` | `Record<string, unknown>` | Structured details for server-side logging |

## Method Pattern Matching

### `matchesMethodPattern(serviceName, methodName, patterns)`

Shared utility for matching gRPC methods against skip/rule patterns. Used internally by all interceptors.

```typescript
import { matchesMethodPattern } from '@connectum/auth';

matchesMethodPattern('user.v1.UserService', 'GetUser', ['user.v1.UserService/*']); // true
matchesMethodPattern('user.v1.UserService', 'GetUser', ['user.v1.UserService/GetUser']); // true
matchesMethodPattern('user.v1.UserService', 'GetUser', ['*']); // true
matchesMethodPattern('user.v1.UserService', 'GetUser', ['admin.v1.AdminService/*']); // false
```

Pattern types:
- `"*"` -- matches all methods
- `"Service/*"` -- matches all methods of a service
- `"Service/Method"` -- matches an exact method

## Testing Utilities

The `@connectum/auth/testing` subpath export provides helpers for testing authenticated handlers.

```typescript
import { createMockAuthContext, createTestJwt, withAuthContext, TEST_JWT_SECRET } from '@connectum/auth/testing';
```

| Export | Description |
|--------|-------------|
| `createMockAuthContext` | Create a mock `AuthContext` with sensible defaults |
| `createTestJwt` | Generate a signed JWT for testing |
| `TEST_JWT_SECRET` | Pre-shared HMAC secret for test JWTs |
| `withAuthContext` | Run a function within a given `AuthContext` (wraps `AsyncLocalStorage.run`) |

## Security Considerations

- **Header stripping**: Auth interceptors strip all `x-auth-*` headers from incoming requests before processing to prevent spoofing from external clients.
- **SEC-001**: `propagatedClaims` option filters which claims are included in propagated headers to prevent leaking sensitive data.
- **SEC-002**: `createJwtAuthInterceptor` throws on missing JWT subject claim instead of silently falling back.
- **HMAC key validation**: Minimum key size enforced per RFC 7518 (32 bytes for HS256, 48 for HS384, 64 for HS512).
- **Header size limits**: Both `setAuthHeaders` and `parseAuthHeaders` enforce 8192-byte limits on roles, scopes, and claims headers to prevent abuse. `setAuthHeaders` silently drops oversized headers; `parseAuthHeaders` ignores them.
- **Gateway header stripping**: `createGatewayAuthInterceptor` strips all mapped headers and the trust header on **every** request -- including skipped methods -- to prevent downstream spoofing.

## Exports Summary

| Export | Subpath | Description |
|--------|---------|-------------|
| `createAuthInterceptor` | `.` | Generic pluggable authentication interceptor |
| `createJwtAuthInterceptor` | `.` | JWT authentication interceptor (jose) |
| `createGatewayAuthInterceptor` | `.` | Gateway-injected headers authentication interceptor |
| `createSessionAuthInterceptor` | `.` | Session-based authentication interceptor |
| `createAuthzInterceptor` | `.` | Declarative rules-based authorization interceptor |
| `authContextStorage` | `.` | AsyncLocalStorage instance for auth context |
| `getAuthContext` | `.` | Get current auth context (or undefined) |
| `requireAuthContext` | `.` | Get current auth context or throw Unauthenticated |
| `setAuthHeaders` | `.` | Serialize AuthContext to headers |
| `parseAuthHeaders` | `.` | Deserialize AuthContext from headers |
| `matchesMethodPattern` | `.` | Method pattern matching utility |
| `LruCache` | `.` | In-memory LRU cache with TTL |
| `AuthzDeniedError` | `.` | Authorization denied error class |
| `AUTH_HEADERS` | `.` | Standard auth header name constants |
| `AuthzEffect` | `.` | Authorization effect constants (ALLOW, DENY) |
| `AuthContext`, `AuthInterceptorOptions`, `JwtAuthInterceptorOptions`, `GatewayAuthInterceptorOptions`, `GatewayHeaderMapping`, `SessionAuthInterceptorOptions`, `AuthzInterceptorOptions`, `AuthzRule`, `CacheOptions`, `InterceptorFactory`, `AuthzDeniedDetails` | `.` | TypeScript types |
| `createMockAuthContext` | `./testing` | Create mock AuthContext for tests |
| `createTestJwt` | `./testing` | Generate signed test JWTs |
| `TEST_JWT_SECRET` | `./testing` | Pre-shared HMAC secret for tests |
| `withAuthContext` | `./testing` | Run function within AuthContext |

## Related Packages

- **[@connectum/core](./core.md)** -- Server that accepts interceptors (peer dependency)
- **[@connectum/interceptors](./interceptors.md)** -- Resilience interceptors (complementary, typically placed before auth in the chain)
- **[@connectum/otel](./otel.md)** -- OpenTelemetry instrumentation (complementary)
