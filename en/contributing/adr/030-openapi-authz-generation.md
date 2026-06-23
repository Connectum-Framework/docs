# ADR-030: OpenAPI generation with proto-authz overlay

## Status

Accepted -- 2026-06-23 (reference pattern shipped in the `car-sharing` example; a framework-level CLI command is a follow-up)

Extends [ADR-024](./024-auth-authz-strategy.md) (auth/authz strategy) and [ADR-029](./029-internal-service-to-service-auth.md) (the `internal` marker).

## Context

Connectum services speak gRPC/Connect, but their contract often has to be consumed by audiences that do not: REST/HTTP clients, API gateways, Swagger UI, client/SDK generators, and external API catalogs. The lingua franca for those is an **OpenAPI** document.

A generator already exists -- [`protoc-gen-connect-openapi`](https://github.com/sudorandom/protoc-gen-connect-openapi) (available as the buf remote plugin `buf.build/community/sudorandom-connect-openapi`) -- and it produces a faithful OpenAPI v3.1 description of the Connect API surface (paths, request/response schemas, `connectrpc` framing).

But it is **blind to Connectum's authorization model**. Connectum expresses authz as proto options consumed at runtime by `createProtoAuthzInterceptor` ([ADR-024](./024-auth-authz-strategy.md)):

- `service_auth` / `method_auth` with `public`, `requires { roles, scopes }`, `policy`, `default_policy`;
- and, from [ADR-029](./029-internal-service-to-service-auth.md), the `internal` marker.

So a bare OpenAPI document says nothing about which operations need a token, which roles/scopes they demand, or which are intentionally world-open. A consumer reading the published contract would not know how to call the secured methods, and an auditor could not see the security posture from the document. Worse, if the security section were filled in by hand, it would be a **second source of truth** that drifts from what the interceptor actually enforces.

The question this ADR settles: *how should an OpenAPI contract be produced so that it reflects Connectum authz without introducing drift, and at what layer of the project should that live right now?*

## Decision

Generate OpenAPI in **two decoupled steps**, and ship it as a **reference pattern in the `car-sharing` example** rather than as a framework feature -- for now.

### 1. Base spec — buf remote plugin

A dedicated buf template (`buf.gen.openapi.yaml`, separate from the offline `buf.gen.yaml`) runs `protoc-gen-connect-openapi` to emit OpenAPI v3.1 under `openapi/`. Keeping it in its own template means the **network-dependent remote plugin never runs during the offline `buf:generate`** (TS codegen and the test suite stay offline and deterministic).

### 2. Authz overlay — one resolver, no drift

A post-processor (`scripts/openapi-authz.ts`) reads the proto authz options through **`resolveMethodAuth`** from `@connectum/auth/proto` -- *the same reader `createProtoAuthzInterceptor` uses at runtime* -- and patches each operation in the generated document. One resolver drives **both** runtime enforcement and the published contract, so the two cannot disagree.

The mapping from Connectum authz to OpenAPI:

| Connectum authz (proto) | `resolveMethodAuth` result | OpenAPI patch on the operation |
|---|---|---|
| `public: true` | `auth.public === true` | `security: []` (explicitly open) + `x-connectum-public: true` |
| gated (default / `requires` / `policy`) | `auth.public === false` | `security: [{ bearerAuth: [] }]` |
| `requires { roles: [...] }` | `auth.requires.roles` | `x-connectum-required-roles: [...]` |
| `requires { scopes: [...] }` | `auth.requires.scopes` | `x-connectum-required-scopes: [...]` |
| `internal: true` (1.1.0, [ADR-029](./029-internal-service-to-service-auth.md)) | `auth.internal === true` | `x-internal: true` |

A single `bearerAuth` (`http`/`bearer`/JWT) security scheme is added to `components.securitySchemes`, matching the gateway's `createJwtAuthInterceptor` contract.

`x-connectum-*` are vendor extensions: they are advisory metadata for humans, gateways, and catalogs (the wire enforcement remains the interceptor's job), while `security` is standard OpenAPI that off-the-shelf tooling already understands.

### 3. Layer — example-level reference pattern, not a shipped CLI

The whole pattern is **example code plus codegen config**. It reads proto and works against the **published `@connectum/auth` 1.0.0** -- it does **not** modify any published package. A first-class `connectum openapi` CLI command that generalises the overlay across arbitrary services is recorded as a **follow-up**, deferred because the generic mechanism is not yet validated and would touch published packages.

## Consequences

### Positive

- **Single source of truth.** Authz is declared once in proto; the runtime interceptor and the published OpenAPI both derive from it via the same resolver -- no drift by construction.
- **Audit-friendly contract.** Reviewers and external consumers see, per operation, whether a token is required and which roles/scopes it demands, in standard OpenAPI plus explicit extensions.
- **Off-the-shelf tooling.** The `security` requirements and `bearerAuth` scheme are consumed as-is by Swagger UI, client generators, and gateways.
- **Offline build stays offline.** The remote plugin is isolated to its own template, so `buf:generate`/tests do not gain a network dependency.
- **No published-package risk.** Shipping it as an example proves the pattern end-to-end before committing the framework to an API.

### Negative

- **Network dependency for generation.** `pnpm openapi` invokes a buf remote plugin; it is not usable fully offline (mitigated by committing the generated `openapi/*.yaml` as the showcase output).
- **Streaming RPCs get no operation** in the base spec unless the plugin's `with-streaming` opt is set (OpenAPI's request/response model does not fit server-/client-/bidi-streaming; an inherent limitation, called out in the guide).
- **Not yet a framework feature.** Each service that wants this today copies the example's overlay; the reusable CLI is still a follow-up.
- **Vendor extensions are advisory.** `x-connectum-*` document intent but do not themselves enforce anything; enforcement remains the interceptor's responsibility.

## Alternatives Considered

- **Hand-write the OpenAPI security sections.** Rejected: a second source of truth that drifts from the interceptor -- exactly the failure this ADR avoids.
- **Ship a `connectum openapi` CLI command now.** Deferred: the generic, multi-service mechanism is unvalidated, and baking it into a published package before the pattern is proven would be premature. Kept as a follow-up.
- **Rely solely on the plugin's `google.api.http` / security handling.** Insufficient: the plugin understands standard annotations, not Connectum's `connectum.auth.v1` options, so it cannot derive `security` from our authz model.
- **[`protodocs`](https://github.com/sudorandom/protodocs) for a docs site.** Deferred: the author states it is not yet ready for use; revisit when it stabilises.

## References

- Reference implementation: the `car-sharing` example (`buf.gen.openapi.yaml`, `scripts/openapi-authz.ts`, committed `openapi/*.yaml`).
- Guide: [OpenAPI](/en/guide/openapi).
- [ADR-024: Auth/Authz Strategy](./024-auth-authz-strategy.md), [ADR-029: Internal Service-to-Service Auth](./029-internal-service-to-service-auth.md).
- [`protoc-gen-connect-openapi`](https://github.com/sudorandom/protoc-gen-connect-openapi).
