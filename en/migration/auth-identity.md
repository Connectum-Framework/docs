---
title: Auth Identity Handling
description: From 1.3.0, the gateway interceptor deletes every x-auth-* header, a verifier result must be a complete AuthContext, a scope with a space is rejected when propagated, and a cached identity is frozen.
docType: migration
---

# Auth Identity Handling

> Applies to `@connectum/auth` 1.3.0.

## Does this apply to you?

You need to act if any of these is true:

- a handler, or a `propagateHeaders` list, relies on `x-auth-*` headers that the **client** sent through `createGatewayAuthInterceptor`;
- `verifyCredentials` (`createAuthInterceptor`) or `mapSession` (`createSessionAuthInterceptor`) can return anything other than a complete `AuthContext`, for example `null` after a failed lookup or an object without `scopes` or `claims`;
- you turn `propagateHeaders` on and a verifier grants a scope that contains a space;
- you use the `cache` option and a handler, or a library it calls, changes the object that `getAuthContext()` returns.

Otherwise nothing changes for you. Valid identities behave as before.

## Required changes

### The gateway interceptor deletes every standard `x-auth-*` header

After `createGatewayAuthInterceptor` has read its mapped input, it removes `x-auth-subject`, `x-auth-type`, `x-auth-name`, `x-auth-roles`, `x-auth-scopes` and `x-auth-claims`, on admitted requests and on `skipMethods`. With `propagateHeaders: true` it then writes the verified identity back. A client-supplied `x-auth-roles` used to survive when the verified identity had no roles, so a service that trusted those headers saw the forged value. The `x-auth-*` names now belong to the verified identity: if you need a client value to reach a handler, have the gateway send it under another name. A gateway that maps `x-auth-*` names in `headerMapping` still reads them.

### Return a complete `AuthContext` from your callbacks

The result needs a string `subject` and `type`, string arrays `roles` and `scopes`, an object `claims`, and, when present, a string `name` and a `Date` `expiresAt`. Any other result ends the call with `Unauthenticated`, with or without `propagateHeaders`, and is not cached. Before, `null`, `undefined`, `false` or `{}` made the call fail with `internal` when headers were propagated, and let the handler run without an identity when they were not.

### Do not grant a scope that contains a space while propagating headers

Scopes travel joined by spaces and are split on spaces, so `reports read admin` reached the next hop as three scopes. It is now rejected with `Unauthenticated` (text `Authentication failed`) and is not cached. With `propagateHeaders` off the identity is admitted.

### Copy a cached identity before you change it

With `cache`, the `AuthContext` is a frozen snapshot, including `roles`, `scopes` and `claims` (nested plain objects and arrays too). Pushing into `roles` throws a `TypeError`. Without `cache` the object your verifier returns is passed through, so code that changes it keeps working there and fails only with the cache on.

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
// Before: changed the identity of every later request with the same token
getAuthContext()!.roles.push('auditor');

// After: build a new value
const roles = [...getAuthContext()!.roles, 'auditor'];
```

## Verify the upgrade

Call a gateway-protected method with a valid trust header and forged `x-auth-roles`, `x-auth-scopes`, `x-auth-name` and `x-auth-claims` headers for a user without those fields: the handler, and any service the headers are forwarded to, must see none of them. Return `null` from your verifier in a test and expect `Unauthenticated`. Run your handler tests with `cache` on.

## Related

- [Gateway authentication](/en/guide/auth/gateway#header-stripping)
- [Auth context](/en/guide/auth/context#propagated-headers)
- [Session authentication](/en/guide/auth/session#errors-from-your-callbacks)
- [Auth option validation](/en/migration/auth-proto-options)
