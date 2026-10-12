---
title: Signed Tokens Must Carry exp
description: From 1.3.0, createJwtAuthInterceptor and signedTokenTrust reject a signed token that has no exp claim unless you opt out.
docType: migration
---

# Signed Tokens Must Carry `exp`

> Applies to 1.3.0.

## Does this apply to you?

You need to act only if **both** are true:

- you verify signed tokens with `createJwtAuthInterceptor`, or with `signedTokenTrust` for internal service-to-service calls;
- the issuer mints tokens **without** an `exp` (expiration time) claim.

Tokens from mainstream identity providers always carry `exp`, as do the tokens made by the `@connectum/auth/testing` helpers. If you are unsure, decode one token (the middle part of the JWT is base64url JSON) and look for `exp`.

## What changed

A signed token without `exp` never expires: a leaked one stays valid until the signing key is rotated. RFC 9068 requires `exp` in a JWT access token, but the verification library checks it only when it is present, so the interceptors used to accept such tokens.

From 1.3.0, a token with no `exp` is rejected as `Unauthenticated`. A token whose `exp` has passed is rejected as before, in both modes.

## Required changes

Preferred: make the issuer add an expiration to every token it mints.

If an issuer cannot, opt out explicitly, per interceptor or per issuer:

```typescript
const jwtAuth = createJwtAuthInterceptor({
  jwksUri: 'https://auth.example.com/.well-known/jwks.json',
  issuer: 'https://auth.example.com/',
  requireExpiration: false, // accept tokens without exp
});

const trust = signedTokenTrust({
  issuers: {
    'legacy-worker': { jwksUri: 'https://legacy.internal/jwks.json', requireExpiration: false },
  },
});
```

Opting out keeps the leaked-token risk for that issuer; `maxTokenAge` limits it only for tokens that carry `iat`.
