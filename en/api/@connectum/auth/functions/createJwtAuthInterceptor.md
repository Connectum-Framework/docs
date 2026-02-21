[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / createJwtAuthInterceptor

# Function: createJwtAuthInterceptor()

> **createJwtAuthInterceptor**(`options`): `Interceptor`

Defined in: [packages/auth/src/jwt-auth-interceptor.ts:168](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/jwt-auth-interceptor.ts#L168)

Create a JWT authentication interceptor.

Convenience wrapper around createAuthInterceptor() that handles
JWT extraction from Authorization header, verification via jose,
and standard claim mapping to AuthContext.

## Parameters

### options

[`JwtAuthInterceptorOptions`](../interfaces/JwtAuthInterceptorOptions.md)

JWT authentication options

## Returns

`Interceptor`

ConnectRPC interceptor

## Examples

```typescript
import { createJwtAuthInterceptor } from '@connectum/auth';

const jwtAuth = createJwtAuthInterceptor({
  jwksUri: 'https://auth.example.com/.well-known/jwks.json',
  issuer: 'https://auth.example.com/',
  audience: 'my-api',
  claimsMapping: {
    roles: 'realm_access.roles',
    scopes: 'scope',
  },
});
```

```typescript
const jwtAuth = createJwtAuthInterceptor({
  secret: process.env.JWT_SECRET,
  issuer: 'my-service',
});
```
