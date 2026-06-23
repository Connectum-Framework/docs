---
outline: deep
---

# OpenAPI

Connectum services speak gRPC/Connect, but their contract often has to reach audiences that do not: REST/HTTP clients, API gateways, Swagger UI, SDK generators, and API catalogs. The common denominator for those is an **OpenAPI** document.

Connectum's authorization lives in `.proto` options ([Proto-Based Authz](/en/guide/auth/proto-authz)). The pattern on this page generates an OpenAPI v3.1 contract that **reflects that authz** -- the same options the `createProtoAuthzInterceptor` enforces at runtime also drive the published spec, so the two cannot drift.

::: tip Reference implementation
The [`car-sharing`](https://github.com/Connectum-Framework/examples/tree/main/car-sharing) example ships this end-to-end (`buf.gen.openapi.yaml`, `scripts/openapi-authz.ts`, committed `openapi/*.yaml`). The rationale is recorded in [ADR-030](/en/contributing/adr/030-openapi-authz-generation).
:::

## How it works

Generation is **two decoupled steps**, run together via one script:

1. **Base spec** -- the [`protoc-gen-connect-openapi`](https://github.com/sudorandom/protoc-gen-connect-openapi) buf remote plugin emits a faithful OpenAPI v3.1 description of the Connect API (paths, schemas, framing). It is accurate about the *shape* but blind to Connectum authz.
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

The overlay walks each service's methods, resolves the proto authz, and patches the corresponding operation. `resolveMethodAuth(method)` returns `{ public, internal?, policy?, requires? }`.

```typescript
import { readFileSync, writeFileSync } from 'node:fs';
import { parse, stringify } from 'yaml';
import { resolveMethodAuth } from '@connectum/auth/proto';
import { OrderService } from '#gen/order/v1/order_pb.ts';

// One JWT bearer scheme, matching createJwtAuthInterceptor at the edge.
const bearerAuth = { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' };

const path = 'openapi/order/v1/order.openapi.yaml';
const doc: any = parse(readFileSync(path, 'utf8'));
doc.components ??= {};
doc.components.securitySchemes ??= {};
doc.components.securitySchemes.bearerAuth = bearerAuth;

for (const method of OrderService.methods) {
  const op = doc.paths?.[`/${OrderService.typeName}/${method.name}`]?.post;
  if (op === undefined) continue; // e.g. streaming RPCs are not emitted by default
  const auth = resolveMethodAuth(method);

  if (auth.public) {
    op.security = []; // explicitly open — overrides any global requirement
    op['x-connectum-public'] = true;
    continue;
  }
  op.security = [{ bearerAuth: [] }];
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
| gated (default / `requires` / `policy`) | `auth.public === false` | `security: [{ bearerAuth: [] }]` |
| `requires { roles: [...] }` | `auth.requires.roles` | `x-connectum-required-roles: [...]` |
| `requires { scopes: [...] }` | `auth.requires.scopes` | `x-connectum-required-scopes: [...]` |
| `internal: true` | `auth.internal === true` | `x-internal: true` |

`security` and the `bearerAuth` scheme are standard OpenAPI that off-the-shelf tooling already understands. The `x-connectum-*` entries are **vendor extensions** -- advisory metadata for humans, gateways, and catalogs. They document intent; the wire enforcement remains the interceptor's job ([Proto-Based Authz](/en/guide/auth/proto-authz)).

## Notes & limitations

- **Streaming RPCs** (server-, client-, or bidi-streaming) get no operation in the base spec unless the plugin's `with-streaming` opt is set -- OpenAPI's request/response model does not fit streaming. The plugin leaves an empty path entry, and the overlay skips any method that has no generated operation. (In `car-sharing`, `FleetService.ListVehicles` is server-streaming and is therefore skipped.)
- **Network dependency.** `pnpm openapi` invokes a buf *remote* plugin, so generation is not fully offline. Commit the generated `openapi/*.yaml` so consumers and CI have the spec without regenerating.
- **The `internal` marker** (`x-internal: true`) requires `@connectum/auth` >= 1.1.0 (see [ADR-029](/en/contributing/adr/029-internal-service-to-service-auth)). On 1.0.0, `internal` methods resolve as gated.
- **Reference pattern, not a CLI (yet).** This is example code plus codegen config; it does not modify any published package. A first-class `connectum openapi` command is a [planned follow-up](/en/contributing/adr/030-openapi-authz-generation).

## Related

- [Proto-Based Authz](/en/guide/auth/proto-authz) -- the authz options this overlay reads
- [@connectum/auth](/en/packages/auth) -- Package Guide (`resolveMethodAuth`, `getPublicMethods`)
- [ADR-030: OpenAPI generation with proto-authz overlay](/en/contributing/adr/030-openapi-authz-generation) -- design rationale
- [`protoc-gen-connect-openapi`](https://github.com/sudorandom/protoc-gen-connect-openapi) -- the base generator
