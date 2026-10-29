---
title: Auth Authorization and JWT Validation
description: From 1.3.0, @connectum/auth refuses a misspelled policy or effect, a truthy non-boolean from authorize, unsupported method patterns, empty JWT expectations and unusable options when an interceptor is created, and admits an internal method only to an identity from the internal interceptor.
docType: migration
---

# Auth Authorization and JWT Validation

> Applies to 1.3.0 of `@connectum/auth`.

## Does this apply to you?

Check each row against your configuration. Only the rows that match need action; the table also shows what you will see if you do nothing.

| # | You have | What you will see on 1.3.0 |
|---|---|---|
| 1 | A `defaultPolicy` or a rule `effect` that is not exactly `'allow'` or `'deny'` (`'Deny'`, `'DENY'`, `''`, `null`) on `createAuthzInterceptor` or `createProtoAuthzInterceptor` | A `TypeError` when the interceptor is created |
| 2 | An `authorize` callback that returns a truthy value that is not `true` (the string `'false'` read from a claim, `1`, `{}`) | `PermissionDenied: Access denied` |
| 3 | An `internal` proto method without `requires`, and a chain in which `createInternalAuthInterceptor` is missing, has `internalMethods: []`, or does not list the method | `Unauthenticated: Untrusted internal request` for every caller that the JWT interceptor authenticated |
| 4 | Tokens whose `sub` is empty, a number or another non-string, or a `claimsMapping.subject` claim that is an empty string | `Unauthenticated: JWT missing subject claim` |
| 5 | `issuer: ''`, `audience: ''` (or an array with an empty entry), or `maxTokenAge: 0` on `createJwtAuthInterceptor` | A `TypeError` (`RangeError` for `maxTokenAge`) when the interceptor is created |
| 6 | A method pattern other than `'*'`, `'Service/*'` and `'Service/Method'` in `skipMethods`, a rule's `methods` or `internalMethods` (`'Service/Write*'`, `'acme.v1.*/*'`, a bare service name) | A `TypeError` naming the option and the pattern when the interceptor is created |
| 7 | A gateway interceptor with `expectedValues: [process.env.X]` and the variable unset, an empty `trustSource.header`, a missing `trustSource`; an internal interceptor without `internalMethods`; a generic interceptor without `verifyCredentials` | A `TypeError` naming the option when the interceptor is created; before, every request failed with `internal` or `Authentication failed` |
| 8 | `createClientBearerInterceptor` with an unset token, or a token factory that can return `undefined` or `null`; `createClientGatewayInterceptor` with an unset `secret` | A `TypeError` when the interceptor is created, or `Unauthenticated` on the client for that call; before, the server received `Bearer undefined` |

Rows 1, 5, 6, 7 and the creation-time part of row 8 surface when the server is composed, so a test that builds the chain finds them. Rows 2, 3, 4 and the per-call part of row 8 surface on a call.

## What changed and what to do

### 1. Policy and effect

Before, authorization compared `defaultPolicy` and every rule `effect` with the string `'deny'` and read anything else as allow. A typo in a configuration file or an environment variable therefore opened every method that no rule matched, and a deny rule written `effect: 'DENY'` allowed.

```typescript
// Before: read as allow
createAuthzInterceptor({ defaultPolicy: 'Deny', rules: [{ name: 'block', methods: ['*'], effect: 'DENY' }] });
// After: exact values, or omit defaultPolicy to get 'deny'
createAuthzInterceptor({ defaultPolicy: 'deny', rules: [{ name: 'block', methods: ['*'], effect: 'deny' }] });
```

The error names the factory, the option, the rule and the value. If the value comes from the environment, map it explicitly:

```typescript
const defaultPolicy = process.env.AUTHZ_DEFAULT === 'allow' ? 'allow' : 'deny';
```

### 2. The `authorize` callback

The callback allows a call only when it returns (or resolves to) exactly `true`. Any other result is `PermissionDenied`.

```typescript
// Before: allowed when the claim was the string "false"
authorize: (ctx) => ctx.claims.isAdmin,
// After
authorize: (ctx) => ctx.claims.isAdmin === true,
```

### 3. Internal methods

An `internal` method without `requires` means "any trusted internal caller", and the caller is trusted only through `createInternalAuthInterceptor`. Before, proto authorization allowed any identity, so an end-user JWT reached the method when the internal interceptor was missing from the chain or did not cover it. Now only an identity that the internal interceptor established is admitted.

The chain from [Proto-based authorization](/en/guide/auth/proto-authz#internal-methods) is unchanged:

```typescript
const internalMethods = getInternalMethods(descriptors);
// jwt skips the internal methods, the internal interceptor covers the same list, proto authz runs last
```

If you fed internal methods from another interceptor (a custom one, the gateway or session interceptor), authenticate those callers with `createInternalAuthInterceptor` and a trust source. An `internal` method that has `requires` keeps checking roles and scopes of whatever identity is present.

### 4. JWT subject

The subject, after `claimsMapping.subject`, must be a non-empty string. Before, only a missing `sub` was an error: an empty string or a number reached the handler as `subject: ''` or `subject: 123`, and a number ended a call with `propagateHeaders: true` as `internal`. Issue string subjects, or map another claim:

```typescript
createJwtAuthInterceptor({ jwksUri, claimsMapping: { subject: 'user_id' } });
```

### 5. Issuer, audience and token age

An empty `issuer` or `audience` used to be skipped as falsy, so a token from any issuer for any audience was accepted. This is the usual result of `issuer: process.env.JWT_ISSUER ?? ''`. A value that is present must be usable, and an omitted option still means "do not check":

```typescript
// Before: no issuer check at all when the variable was missing
createJwtAuthInterceptor({ jwksUri, issuer: process.env.JWT_ISSUER ?? '' });
// After: fail at startup when the variable is missing, or leave the check out on purpose
const issuer = process.env.JWT_ISSUER;
if (!issuer) throw new Error('JWT_ISSUER is required');
createJwtAuthInterceptor({ jwksUri, issuer });
```

`maxTokenAge: 0` used to skip the age check. It now throws a `RangeError`, as do a negative or non-finite number and a blank string. Use a positive number of seconds or a duration string such as `'1h'`, or omit the option. An empty array for `issuer` or `audience` is unchanged: it matches no token.

### 6. Method patterns

`'*'`, `'Service/*'` and `'Service/Method'` are the only patterns that match. A partial wildcard was accepted and never matched, so a `deny` rule on `'Service/Write*'` did nothing. List the methods, or use a whole-service pattern:

```typescript
// Before: accepted, never matched
{ name: 'no-writes', methods: ['data.v1.DataService/Write*'], effect: 'deny' }
// After
{ name: 'no-writes', methods: ['data.v1.DataService/Write', 'data.v1.DataService/WriteBatch'], effect: 'deny' }
```

The check covers `skipMethods` of the generic, JWT, session, gateway and authorization interceptors, the `methods` of every rule, and `internalMethods`. The catch-all `'*'` keeps its own rules: it is valid in rule `methods` and `internalMethods` and refused in `skipMethods` (see [Auth option validation](/en/migration/auth-proto-options)).

### 7. Required options

The gateway, internal and generic interceptors check what they cannot work without. The error names the option and the kind of the bad value, never the value, because `expectedValues` holds a secret:

```
@connectum/auth: createGatewayAuthInterceptor trustSource.expectedValues[0] must be a non-empty string (an unset environment variable reads as undefined); got undefined
```

Read the variable, fail with your own message when it is missing, and pass only a real value.

### 8. Client credentials

`createClientBearerInterceptor` throws a `TypeError` for a static token that is not a non-empty string. A token factory that resolves to anything else fails that call with `Unauthenticated` before a request is sent. Handle the failed refresh in the factory (retry, or throw your own error) so the caller sees the real cause. `createClientGatewayInterceptor` throws a `TypeError` for a `secret` or `subject` that is not a non-empty string.

## Verify

Build your interceptor chain in a test or at startup: rows 1, 5, 6, 7 and 8 fail there with the option named. Then call one method with a token that has an empty `sub`, one internal method with an end-user token, and an `authorize` callback that returns a string, and check that each ends with `Unauthenticated` or `PermissionDenied`.
