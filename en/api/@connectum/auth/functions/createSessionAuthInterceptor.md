[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / createSessionAuthInterceptor

# Function: createSessionAuthInterceptor()

> **createSessionAuthInterceptor**(`options`): `Interceptor`

Defined in: [packages/auth/src/session-auth-interceptor.ts:60](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/auth/src/session-auth-interceptor.ts#L60)

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
