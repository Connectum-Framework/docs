[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / createSessionAuthInterceptor

# Function: createSessionAuthInterceptor()

> **createSessionAuthInterceptor**(`options`): `Interceptor`

Defined in: [packages/auth/src/session-auth-interceptor.ts:60](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/auth/src/session-auth-interceptor.ts#L60)

Create a session-based authentication interceptor.

Two-step authentication:
1. Extract token from request
2. Verify session via user-provided callback (receives full headers for cookie support)
3. Map session data to AuthContext via user-provided mapper

## Parameters

### options

[`SessionAuthInterceptorOptions`](../interfaces/SessionAuthInterceptorOptions.md)

Session auth configuration

## Returns

`Interceptor`

ConnectRPC interceptor

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
