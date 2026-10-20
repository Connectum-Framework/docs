[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / createSessionAuthInterceptor

# Function: createSessionAuthInterceptor()

> **createSessionAuthInterceptor**(`options`): `Interceptor`

Defined in: [packages/auth/src/session-auth-interceptor.ts:66](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/session-auth-interceptor.ts#L66)

Create a session-based authentication interceptor.

Two-step authentication:
1. Extract token from request
2. Verify session via user-provided callback (receives full headers for cookie support)
3. Map session data to AuthContext via user-provided mapper

A `ConnectError` thrown by `verifySession` or `mapSession` reaches the client unchanged
(code and message), so choose its text as public. Any other thrown value is replaced by
`Unauthenticated: Session verification failed` / `Session mapping failed`.

## Parameters

### options

[`SessionAuthInterceptorOptions`](../interfaces/SessionAuthInterceptorOptions.md)

Session auth configuration

## Returns

`Interceptor`

ConnectRPC interceptor

## Throws

When `skipMethods` contains `"*"`

## Throws

When `cache` has a `ttl` that is not finite and positive, or a `maxSize` that is not an integer of at least 1

## Example

**better-auth integration**

```typescript
import { createSessionAuthInterceptor } from '@connectum/auth';

const sessionAuth = createSessionAuthInterceptor({
  verifySession: (token, headers) => auth.api.getSession({ headers }),
  mapSession: (s) => ({
    subject: s.user.id,
    name: s.user.name,
    roles: [],
    scopes: [],
    claims: s.user,
    type: 'session',
  }),
  cache: { ttl: 60_000 },
});
```
