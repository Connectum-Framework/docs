---
title: Generate OpenAPI with Authz
description: Generate an OpenAPI contract from proto and overlay the same Connectum authorization rules used at runtime.
docType: how-to
outline: deep
---

# OpenAPI

Connectum services speak gRPC/Connect, but their contract often has to reach audiences that do not: REST/HTTP clients, API gateways, Swagger UI, SDK generators, and API catalogs. The common denominator for those is an **OpenAPI** document.

Connectum's authorization lives in `.proto` options ([Proto-Based Authz](/en/guide/auth/proto-authz)). The pattern on this page generates an OpenAPI v3.1 contract from those options with the same `resolveMethodAuth` function used by the runtime interceptor. Regenerate the artifact when the proto policy changes so the published spec stays current.

**Outcome:** a reproducible OpenAPI artifact whose operation security is resolved through [`resolveMethodAuth`](/en/api/@connectum/auth/functions/resolveMethodAuth), not a second hand-maintained policy table.

::: tip Reference implementation
The [`car-sharing`](https://github.com/Connectum-Framework/examples/tree/main/car-sharing) example ships this end-to-end (`buf.gen.openapi.yaml`, `scripts/openapi-authz.ts`, committed `openapi/*.yaml`). The rationale is recorded in [ADR-030](/en/contributing/adr/030-openapi-authz-generation).
:::

## How it works

Generation is **two decoupled steps**, run together via one script:

1. **Base spec** -- the [`protoc-gen-connect-openapi`](https://github.com/sudorandom/protoc-gen-connect-openapi) buf remote plugin emits Connect operations and schemas in OpenAPI v3.1. Connectum-specific authorization is added in the next step.
2. **Authz overlay** -- a small post-processor reads the `connectum.auth.v1` options via **`resolveMethodAuth`** from `@connectum/auth/proto` (the *same* reader the runtime interceptor uses) and patches each operation with `security` and `x-connectum-*` extensions.

Keep the OpenAPI generation in its **own** buf template, separate from the one that emits your TypeScript. The remote plugin needs network access; isolating it means your normal `buf:generate` and tests stay offline and deterministic.

### 1. Base spec template

```yaml
# buf.gen.openapi.yaml — separate from buf.gen.yaml (offline TS codegen)
version: v2
clean: true
inputs:
  - directory: proto
plugins:
  - remote: buf.build/community/sudorandom-connect-openapi:v0.25.7
    out: openapi
    opt:
      - format=yaml
      - features=connectrpc
```

### 2. Authz overlay

The overlay walks each service's methods, resolves the proto authz, and patches
the corresponding operation. `resolveMethodAuth(method)` returns `public` and
`internal` booleans, plus `policy` and `requires`, which may be `undefined`.
The header names and schemes below match the example's JWT and internal-token
chain; adapt them to your configured trust sources.

```typescript
import { readFileSync, writeFileSync } from 'node:fs';
import { parse, stringify } from 'yaml';
import { resolveMethodAuth } from '@connectum/auth/proto';
import { OrderService } from '#gen/order/v1/order_pb.ts';

// One JWT bearer scheme, matching createJwtAuthInterceptor at the edge.
const bearerAuth = { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' };
const internalTokenAuth = { type: 'apiKey', in: 'header', name: 'x-internal-token' };

const path = 'openapi/order/v1/order.openapi.yaml';
const doc: any = parse(readFileSync(path, 'utf8'));
doc.components ??= {};
doc.components.securitySchemes ??= {};
doc.components.securitySchemes.bearerAuth = bearerAuth;

for (const method of OrderService.methods) {
  const op = doc.paths?.[`/${OrderService.typeName}/${method.name}`]?.post;
  if (op === undefined) continue; // no generated POST operation to overlay
  const auth = resolveMethodAuth(method);

  if (auth.public) {
    op.security = []; // explicitly open — overrides any global requirement
    op['x-connectum-public'] = true;
    continue;
  }
  if (auth.internal) {
    doc.components.securitySchemes.internalToken = internalTokenAuth;
    op.security = [{ internalToken: [] }];
    op['x-connectum-internal'] = true;
  } else {
    op.security = [{ bearerAuth: [] }];
  }
  if (auth.requires?.roles.length) op['x-connectum-required-roles'] = [...auth.requires.roles];
  if (auth.requires?.scopes.length) op['x-connectum-required-scopes'] = [...auth.requires.scopes];
}

writeFileSync(path, stringify(doc));
```

Wire both steps into one command:

```json
{
  "scripts": {
    "openapi": "buf generate --template buf.gen.openapi.yaml && node scripts/openapi-authz.ts"
  }
}
```

## Authz → OpenAPI mapping

| Connectum authz (proto) | `resolveMethodAuth` | OpenAPI patch on the operation |
|---|---|---|
| `public: true` | `auth.public === true` | `security: []` + `x-connectum-public: true` |
| gated (default / `requires` / `policy`) | `!auth.public && !auth.internal` | `security: [{ bearerAuth: [] }]` |
| `requires { roles: [...] }` | `auth.requires.roles` | `x-connectum-required-roles: [...]` |
| `requires { scopes: [...] }` | `auth.requires.scopes` | `x-connectum-required-scopes: [...]` |
| `internal: true` | `auth.internal === true` | `security: [{ internalToken: [] }]` + `x-connectum-internal: true` |

`security` and the `bearerAuth` scheme are standard OpenAPI that off-the-shelf tooling already understands. The `x-connectum-*` entries are **vendor extensions** -- advisory metadata for humans, gateways, and catalogs. They document intent; the wire enforcement remains the interceptor's job ([Proto-Based Authz](/en/guide/auth/proto-authz)).

The overlay describes credentials and required roles/scopes. It does not encode
the complete authorization decision: a proto `policy: "deny"`, code-based rules,
callbacks, a request gate, and transport restrictions still apply at runtime.
Sharing the resolver keeps annotation resolution consistent; it does not prove
that every operation carrying a credential is callable.

## Notes & limitations

- **Streaming coverage.** In the committed `car-sharing` artifact, the server-streaming `FleetService.ListVehicles` has an empty path entry and no POST operation. The overlay therefore skips it. Inspect the generated artifact when changing plugin options; this pattern does not provide streaming-operation coverage by itself.
- **Network dependency.** `pnpm openapi` invokes a buf *remote* plugin, so generation is not fully offline. Commit the generated `openapi/*.yaml` so consumers and CI have the spec without regenerating.
- **Internal authentication.** `x-connectum-internal: true` documents the annotation. The receiving server must also install the internal-auth chain and the trust source matching `internalToken`; see [internal method setup](/en/guide/auth/proto-authz#internal-methods).
- **Reference pattern.** The generation command comes from the example's `package.json`, not from a `connectum openapi` command. See [ADR-030](/en/contributing/adr/030-openapi-authz-generation) for the rationale and proposed tooling.

## Verify the artifact

Run your `openapi` script after regenerating the TypeScript descriptors from the
same proto input. Check a public operation for `security: []`, a user operation
for `bearerAuth`, and an internal operation for the configured internal scheme
and `x-connectum-internal`. Then check role/scope extensions against the proto
options and inspect any omitted operation. A successful overlay writes YAML; it
does not validate a live server's access policy.

## Related

- [Proto-Based Authz](/en/guide/auth/proto-authz) -- the authz options this overlay reads
- [@connectum/auth](/en/packages/auth) -- Package Guide (`resolveMethodAuth`, `getPublicMethods`)
- [ADR-030: OpenAPI generation with proto-authz overlay](/en/contributing/adr/030-openapi-authz-generation) -- design rationale
- [`protoc-gen-connect-openapi`](https://github.com/sudorandom/protoc-gen-connect-openapi) -- the base generator
