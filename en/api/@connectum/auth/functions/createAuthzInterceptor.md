[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / createAuthzInterceptor

# Function: createAuthzInterceptor()

> **createAuthzInterceptor**(`options?`): `Interceptor`

Defined in: [packages/auth/src/authz-interceptor.ts:85](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/auth/src/authz-interceptor.ts#L85)

Create an authorization interceptor.

Evaluates declarative rules and/or a programmatic callback against
the AuthContext established by the authentication interceptor.

IMPORTANT: This interceptor MUST run AFTER an authentication interceptor
in the chain.

## Parameters

### options?

[`AuthzInterceptorOptions`](../interfaces/AuthzInterceptorOptions.md) = `{}`

Authorization options

## Returns

`Interceptor`

ConnectRPC interceptor

## Example

**RBAC with declarative rules**

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
