---
title: Trust Gateway Authentication
description: Map identity headers from a trusted gateway into the request auth context.
docType: how-to
outline: deep
---

# Gateway Authentication

`createGatewayAuthInterceptor` reads identity headers from a gateway that has already authenticated the caller. Before accepting those fields, the interceptor checks a configured trust header. It does not verify the end-user token itself.

## Configuration

```typescript
import { createGatewayAuthInterceptor } from '@connectum/auth';

const gatewayAuth = createGatewayAuthInterceptor({
  headerMapping: {
    subject: 'x-user-id',
    name: 'x-user-name',
    roles: 'x-user-roles',
  },
  trustSource: {
    header: 'x-gateway-secret',
    expectedValues: [process.env.GATEWAY_SECRET!],
  },
});
```

`headerMapping` describes how trusted gateway headers become an `AuthContext`.
`trustSource` checks a header value before accepting the identity fields. The
example uses a shared secret; the matcher also supports IPv4 CIDR values, which
still rely on a trusted upstream setting the header rather than a socket peer
check. Remove or overwrite client-supplied identity and trust headers at the
gateway, restrict direct access to the service, and protect the hop with TLS. See
[`GatewayAuthInterceptorOptions`](/en/api/@connectum/auth/interfaces/GatewayAuthInterceptorOptions)
for the exact nested fields.

### headerMapping

The `headerMapping` object maps `AuthContext` fields to the header names your gateway uses:

| Field | Expected header value | Example |
|-------|----------------------|---------|
| `subject` | User ID (string) | `x-user-id: user-123` |
| `name` | Display name (string) | `x-user-name: John Doe` |
| `roles` | JSON array or comma-separated roles | `x-user-roles: ["admin","editor"]` or `x-user-roles: admin,editor` |
| `scopes` | Space-separated scopes | `x-user-scopes: read write` |

### trustSource Check

The `trustSource` check accepts requests carrying one of the configured values. A caller who knows the shared secret can also satisfy this check, so deployment controls are part of the trust boundary:

```typescript
trustSource: {
  header: 'x-gateway-secret',
  expectedValues: [process.env.GATEWAY_SECRET!],
}
```

If the header is missing or the value does not match any of the `expectedValues`, the interceptor throws `Unauthenticated`.

## Header Stripping

On an admitted request, the interceptor deletes the mapped headers, the trust
header, and any additional `stripHeaders`. It also deletes them on methods listed
in `skipMethods`, even though authentication is skipped there. Failed trust or
subject checks stop the call before downstream interceptors run.

With the default `propagateHeaders: false`, the deleted headers remain absent.
Enabling `propagateHeaders` writes the verified identity back using the standard
`x-auth-*` names, including all non-empty claims that fit the header limit. This
option does not restore the gateway trust secret. Choose it only when the next
hop needs those fields; gateway authentication has no `propagatedClaims` filter.

## Full Example

```typescript
import { createServer } from '@connectum/core';
import { createDefaultInterceptors, createErrorHandlerInterceptor } from '@connectum/interceptors';
import { createGatewayAuthInterceptor, createAuthzInterceptor } from '@connectum/auth';

const gatewayAuth = createGatewayAuthInterceptor({
  headerMapping: {
    subject: 'x-user-id',
    name: 'x-user-name',
    roles: 'x-user-roles',
  },
  trustSource: {
    header: 'x-gateway-secret',
    expectedValues: [process.env.GATEWAY_SECRET!],
  },
});

const authz = createAuthzInterceptor({
  defaultPolicy: 'deny',
  rules: [
    { name: 'admin', methods: ['admin.v1.AdminService/*'], requires: { roles: ['admin'] }, effect: 'allow' },
  ],
});

const server = createServer({
  services: [routes],
  interceptors: [
    createErrorHandlerInterceptor(),
    gatewayAuth,
    authz,
    ...createDefaultInterceptors({ errorHandler: false }),
  ],
});

await server.start();
```

## Verify

Use a local test secret and call the protected method with both that marker and
the mapped subject. Repeat with no marker, a wrong marker, and no subject; each
must return `Code.Unauthenticated`. Supplying identity headers alone must not
authenticate the caller. Inspect the headers seen by the handler to confirm the
mapped and trust headers are absent with default propagation settings.

If a client gateway interceptor is rejected, compare its fixed `x-auth-subject`
and `x-auth-roles` names with the server's mapping. A trust header match does
not compensate for a mismatched subject header.

## Related

- [Auth Overview](/en/guide/auth) -- all authentication strategies
- [JWT Authentication](/en/guide/auth/jwt) -- direct token verification
- [Auth Context](/en/guide/auth/context) -- accessing identity in handlers
- [@connectum/auth](/en/packages/auth) -- Package Guide
- [@connectum/auth API](/en/api/@connectum/auth/) -- Full API Reference
