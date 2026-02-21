[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / createAuthInterceptor

# Function: createAuthInterceptor()

> **createAuthInterceptor**(`options`): `Interceptor`

Defined in: [packages/auth/src/auth-interceptor.ts:81](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/auth-interceptor.ts#L81)

Create a generic authentication interceptor.

Extracts credentials from request headers, verifies them using
a user-provided callback, and stores the resulting AuthContext
in AsyncLocalStorage for downstream access.

## Parameters

### options

[`AuthInterceptorOptions`](../interfaces/AuthInterceptorOptions.md)

Authentication options

## Returns

`Interceptor`

ConnectRPC interceptor

## Examples

```typescript
import { createAuthInterceptor } from '@connectum/auth';

const auth = createAuthInterceptor({
  extractCredentials: (req) => req.header.get('x-api-key'),
  verifyCredentials: async (apiKey) => {
    const user = await db.findByApiKey(apiKey);
    if (!user) throw new Error('Invalid API key');
    return {
      subject: user.id,
      roles: user.roles,
      scopes: [],
      claims: {},
      type: 'api-key',
    };
  },
});
```

```typescript
const auth = createAuthInterceptor({
  verifyCredentials: async (token) => {
    const payload = await verifyToken(token);
    return {
      subject: payload.sub,
      roles: payload.roles ?? [],
      scopes: payload.scope?.split(' ') ?? [],
      claims: payload,
      type: 'jwt',
    };
  },
});
```
