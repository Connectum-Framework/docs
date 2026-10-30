---
title: Auth Identity Handling
description: From 1.3.0, the gateway interceptor deletes every x-auth-* header and refuses CIDR trust without an opt-in, verifier results must be complete, oversize identities are refused instead of cut, and non-Latin text is encoded.
docType: migration
---

# Auth Identity Handling

> Applies to `@connectum/auth` 1.3.0.

## Does this apply to you?

You need to act if any of these is true:

- a handler, or a `propagateHeaders` list, relies on `x-auth-*` headers that the **client** sent through `createGatewayAuthInterceptor`;
- `trustSource.expectedValues` of `createGatewayAuthInterceptor` contains an IPv4 CIDR block such as `10.0.0.0/8`;
- `verifyCredentials` (`createAuthInterceptor`) or `mapSession` (`createSessionAuthInterceptor`) can return anything other than a complete `AuthContext`, for example `null` after a failed lookup or an object without `scopes` or `claims`;
- you turn `propagateHeaders` on and an identity has a scope that contains a space, a subject over 512 characters, a type over 128, a name over 256, or roles, scopes or claims whose serialized value is over 8192 characters;
- a service that does not use `@connectum/auth` reads `x-auth-subject`, `x-auth-name`, `x-auth-type` or `x-auth-scopes` and can now receive users with non-Latin names.

Otherwise nothing changes for you. Identities that fit, and ASCII and Latin-1 text, are written exactly as before.

## Required changes

### The gateway interceptor deletes every standard `x-auth-*` header

After `createGatewayAuthInterceptor` has read its mapped input, it removes `x-auth-subject`, `x-auth-type`, `x-auth-name`, `x-auth-roles`, `x-auth-scopes`, `x-auth-claims` and `x-auth-encoding`, on admitted requests and on `skipMethods`. With `propagateHeaders: true` it then writes the verified identity back. A client-supplied `x-auth-roles` used to survive when the verified identity had no roles, so a service that trusted those headers saw the forged value. The `x-auth-*` names now belong to the verified identity: if you need a client value to reach a handler, have the gateway send it under another name. A gateway that maps `x-auth-*` names in `headerMapping` still reads them.

### CIDR blocks in `trustSource` need an opt-in

A block is matched against the value of the trust header, and a caller that reaches the service directly chooses that value, so `10.0.0.0/8` or `0.0.0.0/0` admitted anyone who sent a matching address. Creating the interceptor with a well-formed block now throws, naming the block and the header. Prefer a shared secret. If a trusted upstream overwrites the header on every request and no client can reach the service without passing through it, set `trustSource.allowCallerControlledCidr: true`. Shared secrets, including ones that contain a `/`, are unchanged.

### Return a complete `AuthContext` from your callbacks

The result needs a string `subject` and `type`, string arrays `roles` and `scopes`, an object `claims`, and, when present, a string `name` and a `Date` `expiresAt`. Any other result ends the call with `Unauthenticated`, with or without `propagateHeaders`, and is not cached. Before, `null`, `undefined`, `false` or `{}` made the call fail with `internal` when headers were propagated, and let the handler run without an identity when they were not.

### Do not grant a scope that contains a space while propagating headers

Scopes travel joined by spaces and are split on spaces, so `reports read admin` reached the next hop as three scopes. It is now rejected with `Unauthenticated` (text `Authentication failed`) and is not cached. With `propagateHeaders` off the identity is admitted.

### Identities that do not fit their headers are refused

With `propagateHeaders` on, a subject over 512 characters, a type over 128, a name over 256, or roles, scopes or claims whose serialized value is over 8192 characters (after the `propagatedClaims` filter) end the call with `Unauthenticated` and are not cached. Before, the subject was cut, so two subjects that shared their first 512 characters became one identity, and an oversize roles, scopes or claims header was left out, so a deny rule that looks at a role or claim stopped matching. Shorten the identity, filter claims with `propagatedClaims`, or turn propagation off. `parseAuthHeaders` now throws `Unauthenticated` for a header over its limit, the gateway interceptor rejects a claims header over 8192 characters instead of reading `{}`, and `createClientGatewayInterceptor` throws `InvalidArgument` instead of cutting.

### Non-Latin text is encoded, not rejected

A subject, name, type or scope with a character above U+00FF (Cyrillic, CJK, an emoji) used to end the call with `Unauthenticated` when headers were propagated. It is now admitted and written as `utf-8''` plus percent-encoded UTF-8, for example `Иван` becomes `utf-8''%D0%98%D0%B2%D0%B0%D0%BD`. `parseAuthHeaders` and `createGatewayAuthInterceptor` (for the standard `x-auth-*` names) decode it, but only when the sender also set `x-auth-encoding: percent-utf8`, which the writer adds whenever it encoded a text; a literal `utf-8''admin` subject from an older service or another gateway, which sends no such header, stays that literal text. A service that reads these headers without `@connectum/auth` sees the encoded form for such users and should decode it with `decodeURIComponent` after removing the `utf-8''` prefix, when `x-auth-encoding` is present. During a rolling upgrade, an older receiver shows the encoded form for users that were rejected before.

### Cached identities are copied per request

With `cache`, every request receives its own copy of the cached `AuthContext` (including `roles`, `scopes` and `claims`). Before, the cache returned one mutable object to every request with the same credential, so `getAuthContext().roles.push('admin')` in one handler granted the role to later requests with the same token. Code that changes its context keeps working. Each cache hit costs one pass over the identity.

## Before and after

```typescript
// Before: accepted, the handler ran without an identity (or the call failed with `internal`)
createAuthInterceptor({ verifyCredentials: async (key) => await db.findByApiKey(key) });

// After: return a complete AuthContext, or throw
createAuthInterceptor({
  verifyCredentials: async (key) => {
    const user = await db.findByApiKey(key);
    if (!user) throw new Error('Invalid API key');
    return { subject: user.id, roles: user.roles, scopes: [], claims: {}, type: 'api-key' };
  },
});
```

```typescript
// Before: accepted for any caller that sends a matching address
createGatewayAuthInterceptor({
  headerMapping: { subject: 'x-user-id' },
  trustSource: { header: 'x-forwarded-for', expectedValues: ['10.0.0.0/8'] },
});

// After: a shared secret
createGatewayAuthInterceptor({
  headerMapping: { subject: 'x-user-id' },
  trustSource: { header: 'x-gateway-secret', expectedValues: [process.env.GATEWAY_SECRET!] },
});
```

## Verify the upgrade

Call a gateway-protected method with a valid trust header and forged `x-auth-roles`, `x-auth-scopes`, `x-auth-name` and `x-auth-claims` headers for a user without those fields: the handler, and any service the headers are forwarded to, must see none of them. Create the gateway interceptor with your trust list in a startup test: a CIDR block throws. Return `null` from your verifier in a test and expect `Unauthenticated`. Propagate an identity with a Cyrillic name and read it back with `parseAuthHeaders`.

## Related

- [Gateway authentication](/en/guide/auth/gateway#header-stripping)
- [Auth context](/en/guide/auth/context#propagated-headers)
- [Session authentication](/en/guide/auth/session#errors-from-your-callbacks)
- [Auth option validation](/en/migration/auth-proto-options)
