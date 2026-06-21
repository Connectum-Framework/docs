[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / createInternalAuthInterceptor

# Function: createInternalAuthInterceptor()

> **createInternalAuthInterceptor**(`options`): `Interceptor`

Defined in: [packages/auth/src/internal-auth-interceptor.ts:89](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/internal-auth-interceptor.ts#L89)

Create an internal (service-to-service) authentication interceptor.

For methods matched by `internalMethods`, the configured `trustSource`
authorizes the call and sets an `AuthContext`. A trust source returning
`null` (or throwing) is rejected as `Code.Unauthenticated`. Non-internal
methods are a no-op pass-through.

MUST run BEFORE `createProtoAuthzInterceptor`: the internal interceptor
populates the `AuthContext` that proto-authz's `internal` rule consumes.

Each trust-source factory strips its own trust header after extraction on the
internal path (accept and reject), to prevent a spoofed marker from being
propagated downstream. NOTE: for NON-internal methods this interceptor is a
pure pass-through and does NOT strip any trust headers — a request to a
`public`/gated method carrying a forged identity header passes through
untouched. In the supported deployments the mesh sidecar (or an upstream
gateway) terminates the trust boundary and scrubs these headers on every
route; do not rely on this interceptor to sanitize non-internal routes.

## Parameters

### options

[`InternalAuthInterceptorOptions`](../interfaces/InternalAuthInterceptorOptions.md)

Internal auth configuration.

## Returns

`Interceptor`

ConnectRPC interceptor.

## Examples

**Mesh deployment (production default)**

```typescript
import { createInternalAuthInterceptor, meshIdentityTrust, getInternalMethods } from '@connectum/auth';

const internalAuth = createInternalAuthInterceptor({
  internalMethods: getInternalMethods(services),
  trustSource: meshIdentityTrust({
    allowlist: [
      { principal: 'cluster.local/ns/default/sa/trips', roles: ['worker'] },
    ],
  }),
});
```

**Non-mesh, per-service signed tokens**

```typescript
import { createInternalAuthInterceptor, signedTokenTrust, getInternalMethods } from '@connectum/auth';

const internalAuth = createInternalAuthInterceptor({
  internalMethods: getInternalMethods(services),
  trustSource: signedTokenTrust({
    issuers: {
      'trips-service': { jwksUri: 'https://trips/.well-known/jwks.json', claimsMapping: { roles: 'roles' } },
      'billing-service': { jwksUri: 'https://billing/.well-known/jwks.json' },
    },
  }),
});
```
