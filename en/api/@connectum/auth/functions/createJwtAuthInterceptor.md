[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / createJwtAuthInterceptor

# Function: createJwtAuthInterceptor()

> **createJwtAuthInterceptor**(`options`): `Interceptor`

Defined in: [packages/auth/src/jwt-auth-interceptor.ts:194](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/jwt-auth-interceptor.ts#L194)

Create a JWT authentication interceptor.

Convenience wrapper around createAuthInterceptor() that handles
JWT extraction from Authorization header, verification via jose,
and standard claim mapping to AuthContext.

A token is accepted only with a `sub` (or the claim named by `claimsMapping.subject`)
that is a non-empty string; otherwise the call ends with `Unauthenticated: JWT missing
subject claim`.

With `jwksUri`, a failure to get the key set (the identity provider is down, answers with an
error or garbage, or does not answer within `jwks.timeoutDuration`) ends the call with
`Unauthenticated: Authentication failed`, the same as a bad token; nothing is logged. A token signed
with a key that is not in the cached key set triggers a refetch only once `jwks.cooldownDuration`
(30 s by default) has passed since the last successful fetch, and a cached key set older than
`jwks.cacheMaxAge` (10 min by default) is fetched again on the next call, which can come before the
cooldown ends. After a key rotation such a token is therefore rejected for up to the cooldown, and a
retired key keeps verifying only until the next fetch (at the latest when the cache expires); both
are upper bounds, not fixed periods.

## Parameters

### options

[`JwtAuthInterceptorOptions`](../interfaces/JwtAuthInterceptorOptions.md)

JWT authentication options

## Returns

`Interceptor`

ConnectRPC interceptor

## Throws

When `issuer` or `audience` is present and is an empty string, an array with an empty or non-string entry, or another type

## Throws

When `maxTokenAge` is present and is not a finite number greater than 0, or is a blank string

## Throws

When `propagatedClaims` is present and is not an array of non-empty strings

## Throws

When `jwks` is not an object, names an option other than `cooldownDuration`, `cacheMaxAge` or `timeoutDuration`, holds a non-number, or is set without `jwksUri`

## Throws

When `jwks.cooldownDuration` is not a finite number of 0 or more, `jwks.cacheMaxAge` is negative, or `jwks.timeoutDuration` is not a whole number from 1 to 2147483647

## Examples

**JWKS-based JWT auth (Auth0, Keycloak, etc.)**

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

**HMAC secret (testing / simple setups)**

```typescript
const jwtAuth = createJwtAuthInterceptor({
  secret: process.env.JWT_SECRET,
  issuer: 'my-service',
});
```
