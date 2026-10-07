---
title: Auth and Authz
description: Choose authentication, authorization, propagation, and testing paths for a Connectum service.
docType: concept
outline: deep
---

# Auth and Authz

Authentication establishes an `AuthContext`; authorization decides whether that identity may invoke a method. Keep those decisions separate in the interceptor chain even when they are configured together.

## Choose the trust boundary

| Boundary | Start here |
|---|---|
| Clients send bearer JWTs directly | [JWT authentication](/en/guide/auth/jwt) |
| A trusted gateway verifies credentials first | [Gateway authentication](/en/guide/auth/gateway) |
| A web application resolves a session | [Session authentication](/en/guide/auth/session) |
| Internal services attach outgoing identity | [Client interceptors](/en/guide/auth/client-interceptors) |
| RPCs require a trusted service identity instead of an end-user token | [Internal method setup](/en/guide/auth/proto-authz#internal-methods) |
| Handlers need the authenticated identity | [Auth context](/en/guide/auth/context) |

The auth interceptors receive request headers; they do not expose the TLS peer
certificate to an authentication callback. For mTLS-bound identity, have a
trusted gateway or mesh supply a verified identity header and enforce that
boundary as described in the [gateway guide](/en/guide/auth/gateway). Direct
application-level peer-certificate/SAN reading is deferred; see
[ADR-029](/en/contributing/adr/029-internal-service-to-service-auth).

## Choose authorization ownership

Use [proto-based authorization](/en/guide/auth/proto-authz) when access policy belongs with the RPC contract. It keeps public methods, roles, scopes, and the runtime resolver on the same generated descriptor. Use [code-based authorization](/en/guide/auth/authorization) for dynamic rules or legacy services whose policy cannot live in proto options.

```typescript
interceptors: [
  createErrorHandlerInterceptor(),
  createJwtAuthInterceptor({ jwksUri, skipMethods }),
  createProtoAuthzInterceptor({ defaultPolicy: 'deny' }),
  ...createDefaultInterceptors({ errorHandler: false }),
]
```

To turn away requests that carry no credential at all before their body is even read, add a server-wide [request gate](/en/guide/security/request-admission) in front of this chain; it runs before every interceptor, so its errors must already be client-safe.

The security invariant is `error handling → authentication → authorization → remaining behavior`. Public-method discovery and exact factory fields are deliberately not duplicated here; use the focused guide and generated interfaces such as [`JwtAuthInterceptorOptions`](/en/api/@connectum/auth/interfaces/JwtAuthInterceptorOptions).

## Learn, configure, inspect

- Learn the model here and in [ADR-024](/en/contributing/adr/024-auth-authz-strategy).
- Configure a concrete trust boundary in the focused guides above.
- Use the [`@connectum/auth` module hub](/en/packages/auth) and [generated API](/en/api/@connectum/auth/) for exact symbols.
