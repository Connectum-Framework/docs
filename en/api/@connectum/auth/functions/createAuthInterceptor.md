[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / createAuthInterceptor

# Function: createAuthInterceptor()

> **createAuthInterceptor**(`options`): `Interceptor`

Defined in: [packages/auth/src/auth-interceptor.ts:87](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/auth-interceptor.ts#L87)

Create a generic authentication interceptor.

Extracts credentials from request headers, verifies them using
a user-provided callback, and stores the resulting AuthContext
in AsyncLocalStorage for downstream access.

A `ConnectError` thrown by `verifyCredentials` reaches the client unchanged (code and
message), so choose its text as public. Any other thrown value is replaced by
`Unauthenticated: Authentication failed`.

## Parameters

### options

[`AuthInterceptorOptions`](../interfaces/AuthInterceptorOptions.md)

Authentication options

## Returns

`Interceptor`

ConnectRPC interceptor

## Throws

When `skipMethods` contains `"*"`

## Throws

When `cache` has a `ttl` that is not finite and positive, or a `maxSize` that is not an integer of at least 1

## Examples

**API key authentication**

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

**Bearer token with default extractor**

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
