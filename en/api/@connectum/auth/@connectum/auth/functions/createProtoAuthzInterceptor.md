[Connectum API Reference](../../../../../index.md) / [@connectum/auth](../../../index.md) / [@connectum/auth](../index.md) / createProtoAuthzInterceptor

# Function: createProtoAuthzInterceptor()

> **createProtoAuthzInterceptor**(`options?`): `Interceptor`

Defined in: [packages/auth/src/proto/proto-authz-interceptor.ts:125](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/proto/proto-authz-interceptor.ts#L125)

Create a proto-based authorization interceptor.

Uses protobuf custom options (connectum.auth.v1) for declarative authorization
rules defined in .proto files. When proto options do not resolve the decision,
falls back to programmatic rules and an authorize callback.

Authorization decision flow:
```
1. resolveMethodAuth(req.method)  -- read proto options
2. public = true                  --> skip (allow without authn)
3. Get auth context               -- lazy: don't throw yet
4. requires defined, no context   --> throw Unauthenticated
4b. requires defined, has context --> satisfiesRequirements? allow : deny
5. policy = "allow"              --> allow
6. policy = "deny"               --> deny
7. Evaluate programmatic rules   -- unconditional rules work without context
8. Fallback: authorize callback  --> requires auth context
9. Apply defaultPolicy           --> deny without context = Unauthenticated
```

IMPORTANT: This interceptor MUST run AFTER an authentication interceptor
in the chain (except for methods marked as `public` in proto options
or matched by unconditional programmatic rules).

## Parameters

### options?

[`ProtoAuthzInterceptorOptions`](../interfaces/ProtoAuthzInterceptorOptions.md) = `{}`

Proto authorization interceptor options

## Returns

`Interceptor`

ConnectRPC interceptor

## Examples

```typescript
import { createProtoAuthzInterceptor } from '@connectum/auth';

const authz = createProtoAuthzInterceptor();
// Proto options in .proto files control authorization
```

```typescript
import { createProtoAuthzInterceptor } from '@connectum/auth';

const authz = createProtoAuthzInterceptor({
  defaultPolicy: 'deny',
  rules: [
    { name: 'admin-only', methods: ['admin.v1.AdminService/*'], requires: { roles: ['admin'] }, effect: 'allow' },
  ],
  authorize: (ctx, req) => ctx.roles.includes('superadmin'),
});
```
