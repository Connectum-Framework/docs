# ADR-029: Internal (service-to-service) auth, distinct from `public`

## Status

Proposed -- 2026-06-21

Tracks [#171](https://github.com/Connectum-Framework/connectum/issues/171). Extends [ADR-024](./024-auth-authz-strategy.md) (auth/authz strategy).

## Context

[ADR-024](./024-auth-authz-strategy.md) defines two authorization states for an RPC, expressed as proto options consumed by `createProtoAuthzInterceptor` / the JWT auth interceptor's `skipMethods`:

- **gated** -- a `default_policy: "allow"`/`"deny"` service plus per-method policies; the JWT auth interceptor must authenticate the caller.
- **`public`** -- `service_auth { public: true }` or `method_auth { public: true }`: authentication is skipped entirely; anyone reachable on the wire may call it.

A third, real situation has no first-class expression: an **internal, service-to-service** call that carries no end-user JWT but is *not* meant to be world-open. It surfaced while building the `car-sharing` Temporal example (Phase 2):

- The trip saga runs in a **Temporal worker** (a separate process, not a Connectum `Server`). Its activities call internal RPCs (`TripService.RecordTrip`, `EndTrip`) over the network with **no `Authorization` header** -- Connectum does not auto-propagate inbound headers across a worker's client.
- To let those calls through, the methods are annotated **`method_auth { public: true }`**. But the real trust boundary is the **mesh** (Istio mTLS `STRICT` + an `AuthorizationPolicy` that admits only the trips ServiceAccount). The proto now says "public" -- over-stating exposure and reading wrong to anyone auditing the contract.

So today **`public` is overloaded**: it means both "intentionally world-open" (a health probe) and "internal, trusted by the network boundary" (a worker-only RPC). They have different security postures and should be auditable as different things.

The same gap exists for any out-of-process internal caller: schedulers, batch jobs, the new `createCatalogClient` ([#170](https://github.com/Connectum-Framework/connectum/issues/170)).

Existing building block: `createGatewayAuthInterceptor` (`@connectum/auth`) already authorizes a request from **identity injected by a trusted upstream** (a gateway/mesh) via a `trustSource` predicate + header stripping. That trust-source machinery is most of what an internal interceptor needs -- it just is not wired to a proto-level "this method is internal" marker.

## Decision (proposed)

Introduce a first-class **`internal`** marker, distinct from `public`, plus an interceptor that authorizes internal calls by a configurable **trust source** rather than by an end-user token.

### 1. Proto annotation

Add an `internal` boolean to the existing auth options (alongside `public`):

```proto
// connectum/auth/v1/options.proto
message ServiceAuth { optional bool public = ...; optional bool internal = ...; /* ... */ }
message MethodAuth  { optional bool public = ...; optional bool internal = ...; }
```

`internal: true` means: **skip end-user (JWT) authentication, but require an internal trust marker** (see §2). `public` keeps its meaning (no auth at all). A method is at most one of `public` / `internal` / gated; `resolveMethodAuth` (the existing service+method merge in `@connectum/auth`) is extended to surface `internal`.

### 2. `createInternalAuthInterceptor`

A new interceptor in `@connectum/auth` that, for `internal` methods, authorizes the call from a **trust source** and rejects anything lacking it as `Unauthenticated`. The trust source is configurable (pick per deployment), reusing the `createGatewayAuthInterceptor` trust-source pattern:

- **mesh identity header** -- a header the mesh injects from the verified mTLS peer identity (e.g. an Istio-forwarded ServiceAccount / SPIFFE id), validated against an allow-list. The default for a mesh deployment.
- **shared internal credential** -- a static/loaded secret the internal caller presents (for non-mesh setups), constant-time compared.
- (optional) **mTLS SAN** -- read directly from the TLS peer certificate when the server terminates mTLS itself.

For non-`internal`, non-`public` methods the interceptor is a no-op (the JWT/authz chain handles them). It sits in the ADR-024 chain after `errorHandler`, alongside the JWT auth interceptor.

### 3. `skipMethods` / authz interaction

`internal` methods are excluded from the JWT auth interceptor (like `public`), and `createProtoAuthzInterceptor` treats an authenticated-internal call as authorized for that method. Crucially, an `internal` method is **not** reachable by an external JWT caller that merely authenticated -- it requires the internal trust marker, so promoting a method from `public` to `internal` *removes* world-open exposure.

## Options considered

1. **New `internal` annotation + interceptor (recommended).** Auditable in the contract, distinct posture from `public`, reuses the proven trust-source machinery. Cost: a proto option + a new interceptor + docs.
2. **Document `createGatewayAuthInterceptor` for service-to-service; no new annotation.** Cheapest, but leaves the proto saying `public` -- the audit/over-exposure problem (the actual motivation) remains.
3. **mTLS-only (no annotation), authorize every call by peer identity.** Strong, but couples the framework to mTLS termination and does not express intent in the contract; many deployments terminate mTLS at the mesh sidecar, not the app.

## Consequences

- **Positive:** internal calls stop masquerading as `public`; the contract is auditable; out-of-process callers (worker, scheduler, `createCatalogClient`) have a sanctioned, non-world-open path; the mesh stays the enforcement layer while the app expresses intent.
- **Negative / cost:** a new proto option (additive; BSR contract update per the repo rule), a new `@connectum/auth` interceptor + tests + docs, and a migration note for examples currently using `public` for worker-internal RPCs (e.g. `car-sharing` `RecordTrip`/`EndTrip`).
- **Compatibility:** purely additive (new option defaulting false, new interceptor opt-in). Existing `public` and gated behavior unchanged.

## Open questions (for ratification)

1. **Default trust source** -- mesh identity header (allow-list) vs shared credential, and the exact header/claim name and validation.
2. **Annotation surface** -- `internal` as a sibling of `public` (proposed) vs a richer `method_auth { requires_identity: [...] }` that also covers role-gating.
3. **mTLS termination** -- whether to support reading the peer cert SAN directly (server-terminated mTLS) in the first cut or defer it.
4. Whether the example migration (`public` → `internal` for worker RPCs) lands with this ADR or as a follow-up.
