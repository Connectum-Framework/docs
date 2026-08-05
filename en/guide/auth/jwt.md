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

Choose exactly one key source (`jwksUri`, `publicKey`, or `secret`), then constrain the
expected issuer, audience, age, and algorithms for your identity provider. Use
`claimsMapping` only for the claims that become application identity. See
[`JwtAuthInterceptorOptions`](/en/api/@connectum/auth/interfaces/JwtAuthInterceptorOptions)
for the complete field contract and defaults.

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

```mermaid
flowchart LR
    Jwks[jwksUri] -->|preferred over| PublicKey[publicKey]
    PublicKey -->|preferred over| Secret[secret]
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
