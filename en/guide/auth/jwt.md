---
outline: deep
---

# JWT Authentication

`createJwtAuthInterceptor` verifies JSON Web Tokens from the `Authorization: Bearer <token>` header. It supports three key resolution strategies: JWKS, HMAC secret, and public key.

## JWKS (Recommended for Production)

JWKS (JSON Web Key Set) is the recommended approach. The interceptor fetches and caches signing keys from the identity provider automatically:

```typescript
import { createJwtAuthInterceptor } from '@connectum/auth';

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
```

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `jwksUri` | `string` | Yes (if no `publicKey`/`secret`) | URL to the JWKS endpoint |
| `issuer` | `string` | No | Expected `iss` claim |
| `audience` | `string` | No | Expected `aud` claim |
| `maxTokenAge` | `string` | No | Maximum acceptable token age (e.g. `'1h'`, `'30m'`) |
| `claimsMapping` | `object` | No | Map JWT claims to `AuthContext` fields |

## HMAC Secret

For simple setups and testing environments where tokens are signed with a shared secret:

```typescript
const jwtAuth = createJwtAuthInterceptor({
  secret: process.env.JWT_SECRET,
  issuer: 'my-service',
});
```

::: warning
HMAC secrets require both the issuer and the verifier to know the secret. Use JWKS in production to avoid sharing signing keys.
:::

## Public Key

For asymmetric verification with a pre-loaded public key:

```typescript
const publicKey = await crypto.subtle.importKey(
  'spki', keyData, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, true, ['verify'],
);

const jwtAuth = createJwtAuthInterceptor({ publicKey });
```

## Key Resolution Priority

When multiple key sources are provided, resolution follows this priority:

```
jwksUri > publicKey > secret
```

At least one must be provided. If `jwksUri` is set, `publicKey` and `secret` are ignored.

## Full Example

```typescript
import { createServer } from '@connectum/core';
import { createDefaultInterceptors } from '@connectum/interceptors';
import { createJwtAuthInterceptor, createAuthzInterceptor } from '@connectum/auth';

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

const server = createServer({
  services: [routes],
  interceptors: [...createDefaultInterceptors(), jwtAuth],
});

await server.start();
```

## Related

- [Auth Overview](/en/guide/auth) -- all authentication strategies
- [Authorization](/en/guide/auth/authorization) -- RBAC rules and programmatic authorization
- [Auth Context](/en/guide/auth/context) -- accessing identity in handlers
- [@connectum/auth](/en/packages/auth) -- Package Guide
- [@connectum/auth API](/en/api/@connectum/auth/) -- Full API Reference
