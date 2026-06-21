# ADR-029: Internal (service-to-service) auth, distinct from `public`

## Status

Accepted -- 2026-06-21 (design ratified; implementation is a follow-up)

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

### 2. `createInternalAuthInterceptor` — a **pluggable per-service trust source**

A new interceptor in `@connectum/auth` that, for `internal` methods, authorizes the call from a configurable **trust source** (a predicate returning `AuthContext | null`, reusing the `createGatewayAuthInterceptor` pattern) and rejects anything lacking it as `Unauthenticated`. The credential must be **per-service**, so compromising one microservice cannot forge another's identity — a single static shared secret is explicitly **not** the default. Three factories:

- **(a) `meshIdentityTrust` (production default — inherently per-service).** Verify the mesh-forwarded peer identity (the sidecar terminates mTLS and forwards a header — an Istio short-form ServiceAccount `cluster.local/ns/<ns>/sa/<sa>` or a SPIFFE id) against an allow-list; allow-list entries carry the caller's roles/scopes. The mesh issues each workload its **own** mTLS identity, so this is per-service by construction.
- **(b) `signedTokenTrust` (non-mesh containment path — per-service, NOT a shared secret).** Each caller signs a short-lived JWT with its **own** private key; the interceptor verifies it via that service's public key (JWKS), reusing the existing `createJwtAuthInterceptor` JWKS machinery. Compromising service A's key forges only A.
  - **Hard security requirement (verified empirically with `jose`):** the JWKS lookup MUST be **issuer-bound** — select the key from `jwksByIssuer[iss]` (or run N verifiers, each pinned to one `jwksUri` + a fixed `issuer`). A single shared JWKS holding multiple services' keys does **not** contain compromise: `jose` resolves the signing key by `kid` independently of the `iss` claim, so a token claiming `iss: "B"` signed with A's key (header `kid: kid_A`) is accepted against a shared keyset. Without issuer-binding, (b) is **weaker than an honest shared secret** because it advertises containment it does not deliver. The framework ships only the **verification** primitive; key issuance/rotation/JWKS publication belong to the deployment (SPIRE / the IdP / the mesh) — Connectum adds no key-management subsystem.
- **(c) `sharedSecretTrust` (documented dev-only fallback).** A single loaded secret, constant-time compared. Simplest, but **not** per-service — one compromise forges all — so it is for local/dev only and labeled as such.

For non-`internal`, non-`public` methods the interceptor is a no-op. **Chain ordering is load-bearing:** the internal interceptor (and the JWT interceptor) run **before** `createProtoAuthzInterceptor` — they populate the `AuthContext` that proto-authz then consumes — i.e. `errorHandler → (jwtAuth | internalAuth) → protoAuthz → …`, not "alongside".

### 3. Inclusive composition with the existing authz model

`internal` is a boolean sibling of `public` in `service_auth`/`method_auth`; roles compose through the **existing** `requires { roles, scopes }` option — there is **no** parallel `requires_identity` mechanism. The internal interceptor sets a normal `AuthContext` (subject = the service identity; roles/scopes from the trust source). `createProtoAuthzInterceptor` gains one rule so `internal` composes inclusively within its current flow:

- `internal` + identity present + **no** `requires` → **allow** (an internal method with no role gate is reachable by any trusted internal caller). (Without this, an `internal`-only method falls through to the existing `default_policy: "deny"` and is wrongly rejected.)
- `internal` + `requires {roles/scopes}` → fall through to the **existing** roles/scopes check against the `AuthContext` (one model, inclusive — the internal identity's roles gate the call exactly like a JWT caller's).
- `internal` + **no** identity → `Unauthenticated`.

`resolveMethodAuth` is extended to surface `internal`; the JWT auth interceptor skips internal methods via a new `getInternalMethods` (mirroring `getPublicMethods`). Promoting a method `public → internal` thus **removes** world-open exposure (it now requires the internal trust marker, not merely any authenticated JWT).

## Options considered

1. **New `internal` annotation + interceptor (recommended).** Auditable in the contract, distinct posture from `public`, reuses the proven trust-source machinery. Cost: a proto option + a new interceptor + docs.
2. **Document `createGatewayAuthInterceptor` for service-to-service; no new annotation.** Cheapest, but leaves the proto saying `public` -- the audit/over-exposure problem (the actual motivation) remains.
3. **mTLS-only (no annotation), authorize every call by peer identity.** Strong, but couples the framework to mTLS termination and does not express intent in the contract; many deployments terminate mTLS at the mesh sidecar, not the app.

## Consequences

- **Positive:** internal calls stop masquerading as `public`; the contract is auditable; out-of-process callers (worker, scheduler, `createCatalogClient`) have a sanctioned, non-world-open path; the mesh stays the enforcement layer while the app expresses intent.
- **Negative / cost:** a new proto option (additive; BSR contract update per the repo rule), a new `@connectum/auth` interceptor + tests + docs, and a migration note for examples currently using `public` for worker-internal RPCs (e.g. `car-sharing` `RecordTrip`/`EndTrip`).
- **Compatibility:** purely additive (new option defaulting false, new interceptor opt-in). Existing `public` and gated behavior unchanged.

## Ratified decisions (2026-06-21)

1. **Trust source — both (a) and (b), per-service.** Ship `meshIdentityTrust` (a, production default) + `signedTokenTrust` (b, non-mesh, per-service JWT/JWKS **with mandatory issuer-bound key selection**) + `sharedSecretTrust` (c, dev-only fallback). No single static shared secret as the recommended mode. (b)'s issuer-binding is a hard security requirement (§2), not optional.
2. **Annotation surface — stay in the model.** `internal` is a boolean sibling of `public`; roles compose **inclusively** through the existing `requires {roles,scopes}` option (§3). The richer `requires_identity` is rejected.
3. **mTLS SAN reading (option c — app reads the peer cert) — DEFER.** ConnectRPC interceptors have no peer-cert access and `@connectum/core` exposes no peer-cert surface, so app-level SAN reading needs new core plumbing. In mesh deployments the sidecar terminates mTLS and forwards identity as a header (that **is** option (a)), so (a)+(b) cover the motivating worker case and the absence of (c) blocks nothing there. App-terminated mTLS without a mesh is the only case (c) would serve; deferred to a follow-up that designs the core peer-cert surface.
4. **Example migration (`car-sharing` `RecordTrip`/`EndTrip` `public` → `internal`) — separate follow-up**, not part of this ADR. The ADR stays purely additive.

## Implementation notes

- `connectum/auth/v1/options.proto`: add `internal` to `ServiceAuth`/`MethodAuth` — additive; the auth proto path is already in `release.yml`'s "Check proto changes" list (confirm at implementation).
- New `@connectum/auth` exports: `createInternalAuthInterceptor`, the three trust-source factories, `getInternalMethods`; extend `resolveMethodAuth` + `createProtoAuthzInterceptor` (the one inclusive rule of §3).
- Tests: per-service containment (the issuer-bound (b) MUST reject A-signed-as-B — the empirical case from §2), the inclusive role composition, and the `internal`-no-identity → `Unauthenticated` path.
