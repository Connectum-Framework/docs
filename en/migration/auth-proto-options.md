---
title: Auth Option Validation
description: From 1.3.0, @connectum/auth rejects misspelled proto policies, public-and-internal methods, a catch-all skipMethods, unsafe propagated identities and unusable cache bounds, and signedTokenTrust identifies callers by their verified issuer.
docType: migration
---

# Auth Option Validation

> Applies to 1.3.0 of `@connectum/auth`.

## Does this apply to you?

Check each row against your configuration. Only the rows that match need action; the table also shows what you will see if you do nothing.

| # | You have | What you will see on 1.3.0 |
|---|---|---|
| 1 | A `policy` or `default_policy` proto option that is not exactly `allow` or `deny` (`"Allow"`, `"dney"`, `"permit"`) | An `Error` naming the value, the method and the option when the method is resolved |
| 2 | A method that is both `public` and `internal` (set on the method or inherited from the service) | An `Error` that suggests `public: true, internal: false` |
| 3 | `signedTokenTrust` issuers that rely on the token's `sub` or `scope` claim | The subject is the issuer name and the scopes are empty; a mapped subject that is absent rejects the call |
| 4 | `skipMethods: ['*']` on an auth or authorization interceptor | An `Error` when the interceptor is created |
| 5 | `propagateHeaders: true` and an identity whose subject, type, name or a scope contains NUL, CR or LF | `Unauthenticated`, and the identity is not cached |
| 6 | A gateway `defaultType` containing NUL, CR or LF | An `Error` when the interceptor is created |
| 7 | A `cache` with `ttl: Infinity` or `NaN`, or `maxSize` below 1, fractional, `NaN` or `Infinity` | A `RangeError` when the interceptor is created |

Rows 1 and 2 are found at startup if you build the interceptor chain with `getPublicMethods(services)` and `getInternalMethods(services)`, because those resolve every method; otherwise the error appears on the first call to the affected method.

## What changed and what to do

### 1. Invalid policy string

Before 1.3.0 any other string was read as "not set", so the decision silently fell to the interceptor `defaultPolicy`. A typo in `default_policy: "dney"` therefore behaved as `defaultPolicy` allowed or denied, without a trace. The values are `"allow"` and `"deny"` in lowercase; an empty string still means "not set".

```protobuf
// Before: read as unset
option (connectum.auth.v1.service_auth) = { default_policy: "Allow" };
// After: use the exact value, or remove the option to use the interceptor default
option (connectum.auth.v1.service_auth) = { default_policy: "allow" };
```

### 2. Public and internal together

`public` skips every check and `internal` requires a trusted peer; a method cannot be both, and before 1.3.0 `public` silently won. Set `public: true, internal: false` to make a method public, for example when a service marked `internal` has one open probe method, or remove `public` to keep the method internal.

```protobuf
service TripService {
  option (connectum.auth.v1.service_auth) = { internal: true };
  // A public probe inside an internal service: say so explicitly
  rpc Probe(ProbeRequest) returns (ProbeResponse) {
    option (connectum.auth.v1.method_auth) = { public: true, internal: false };
  }
}
```

### 3. `signedTokenTrust` identity

The caller is the service whose own key signed the token. `AuthContext.subject` is now the verified `iss` (the key of the issuer in `issuers`). Before 1.3.0 it was `sub` when present, so a service could name itself as another service; the `scope` claim also granted scopes without being mapped. Both are still read when you name them:

```typescript
signedTokenTrust({
  issuers: {
    'trips-service': {
      jwksUri: 'https://trips.internal/.well-known/jwks.json',
      // add only what you relied on
      claimsMapping: { subject: 'sub', scopes: 'scope', roles: 'roles' },
    },
  },
});
```

A mapped `subject` that is absent, empty or not a string rejects the call as `Unauthenticated` instead of falling back to another identity. The raw claims remain in `AuthContext.claims`.

If your handlers or `authorize` callbacks compare `subject` with the token's `sub`, compare it with the issuer name instead, or map `sub` as above. An authorization rule that read `scope` without an explicit mapping now sees no scopes.

### 4. Catch-all in `skipMethods`

`skipMethods: ['*']` switched the interceptor off for every method and is almost always a leftover. Now `createAuthInterceptor`, `createJwtAuthInterceptor`, `createSessionAuthInterceptor`, `createGatewayAuthInterceptor` and `createAuthzInterceptor` throw when they are created with it:

```
skipMethods must not contain the catch-all pattern "*"; to disable this interceptor, do not register it, or list Service/* patterns
```

To disable an interceptor, do not put it in the chain (build the list conditionally). To skip whole services, list `'pkg.v1.Service/*'`. The pattern `'*'` stays valid in the `methods` of an authorization rule and in `internalMethods`.

### 5. Unsafe identity with `propagateHeaders`

With `propagateHeaders`, a subject, type, name or any single scope that contains NUL, CR or LF is rejected with `Unauthenticated` (`Authentication failed`) before the identity is cached; the next request with the same credential is verified again. Such values are not cleaned up, because removing a line break would make `al\nice` and `alice` the same subject downstream. With `propagateHeaders` off nothing changes.

Fix the identity provider or the mapper so these fields have no line breaks or NUL. Scopes are written exactly as granted and are never edited. `setAuthHeaders` called directly throws a `TypeError` that names the field (`AuthContext.subject`, `type`, `name` or `scopes`) and sets no header; before 1.3.0 NUL was stripped and CR and LF made the platform throw.

### 6. Gateway `defaultType`

The credential type used when the gateway sends no type header is `defaultType`, `'gateway'` unless set. A value with NUL, CR or LF would fail every request that falls back to it, so the interceptor now refuses to be created with one.

### 7. Cache bounds

`ttl` must be finite and greater than 0, and `maxSize` (default 1000) an integer of at least 1. `Infinity` kept an identity for ever, `NaN` disabled expiry, and a `maxSize` below 1 or `NaN` or `Infinity` stopped the cache from evicting. Choose a real lifetime in milliseconds and a size that bounds memory:

```typescript
createAuthInterceptor({ verifyCredentials, cache: { ttl: 60_000, maxSize: 5_000 } });
```

## Documented contracts (no action needed)

These behaviors are unchanged but are now stated in the guides:

- An empty `roles` or `scopes` list in `requires` restricts nothing in that dimension, and `requires {}` admits any authenticated caller ([Proto-based authorization](/en/guide/auth/proto-authz#available-options)).
- A `ConnectError` thrown by `verifyCredentials`, `verifySession` or `mapSession` reaches the client with its own code and text; any other thrown value becomes a fixed `Unauthenticated` text ([Session authentication](/en/guide/auth/session#errors-from-your-callbacks)).

## Verify

Start the application and call one public, one internal and one protected method. Startup must not throw; if it does, the message names the option and the method. For `signedTokenTrust`, log `getAuthContext()?.subject` in an internal handler and confirm it is the caller's issuer name.
