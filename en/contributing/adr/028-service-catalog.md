# ADR-028: Service Catalog

## Status

Accepted -- 2026-06-15

## Context

[ADR-026](./026-eventbus-architecture.md) and [ADR-027](./027-external-contracts-vs-eventbus.md) cover the asynchronous, event-driven path between services. The synchronous, request-response path between services was left to each adopter to assemble by hand on top of the transport layer.

A prior `in-process-transport` change had already delivered the transport primitives: `createLocalTransport`, `server.client(Desc, { fallback })`, and `server.hasService`. But the transport layer is only a third of what a hybrid (monolith ↔ microservices) deployment needs. Analysing three production code bases that build on Connectum surfaced a recurring, duplicated **DX layer** that everyone re-implements on top of the transport:

- **fintech-monolith** -- 8 services in one process, pure dependency-injection composition, no cross-service RPC inside handlers. A catalog is **not needed** here. The hard constraint this case imposes: today's `createServer({ services })` must keep working with no catalog, no resolver, and no `enabledServices`.
- **meshai** -- 5+ "skill" services behind k8s + a service mesh, where one proto descriptor is reused for N different endpoints. ~60 lines of copy-pasted boilerplate (a gateway-auth interceptor, an env-driven endpoint registry, a hand-rolled `Map<key, Transport>` cache, a custom resolver function) repeated across 3 files.
- **AnyLabel** -- 8 services over docker/k8s with fixed routing, 18 environment variables (`INGEST_API_URL`, `MALLENOM_BASE_URL`, …) and 5 files with a duplicated `createDefaultInterceptors + createOtelInterceptor` boot section.

The unifying observation: a catalog describes **deployment topology** (what is local, what is remote, and at what address) layered on top of **proto contracts** (which must not know about topology). Therefore all of the catalog / resolver / `enabledServices` description must live exclusively in runtime/boot code, never in proto.

The goal of this ADR is a single declarative DX layer for cross-service calls that satisfies all three cases without forcing topology into proto and without breaking the catalog-free monolith. Because the framework's first stable release (1.0.0) is not yet published, removals required to land a clean API are pre-publish breaking and do not require a major version bump.

## Decision

Add a **service catalog** to `@connectum/core` plus a buf code-generation plugin `@connectum/protoc-gen-catalog`. The catalog is a plain registry of proto descriptors; topology is supplied at boot; handlers make declarative cross-service calls through a typed `ctx.call` / `ctx.stream` surface on the handler context.

### 1. Declarative cross-service calls via `ctx.call` / `ctx.stream` on a Connectum `Context`

Handlers registered through `defineService` receive a Connectum `Context` (`packages/core/src/context.ts`) as their second argument instead of the raw ConnectRPC `HandlerContext`. `Context extends HandlerContext`, so every existing field (`signal`, `timeoutMs()`, `requestHeader`, `values`, …) keeps working, and it adds two members:

- `call<K extends keyof ConnectumCallMap>(method, request, options?)` -- invokes a unary service in the catalog and returns a `Promise`.
- `stream<K extends keyof ConnectumStreamMap>(method)` -- opens a streaming call, returning a kind-specific factory (server-streaming yields an `AsyncIterable`; client- and bidi-streaming return push handles).

The call/stream key is `"<typeName>/<method>"` (e.g. `"orders.v1.OrdersService/GetOrder"`). The transport is chosen automatically per call: an in-process call when the target is mounted locally, otherwise the resolver-supplied transport.

**Rationale.** `Context` is implemented as a thin wrapper over ConnectRPC's `HandlerContext` rather than by stuffing the catalog primitives into ConnectRPC's `ContextValues`. `HandlerContext` is ConnectRPC-owned and effectively read-only -- it is not an extension point the framework can add typed methods to -- and `ContextValues` is a data-only bag with no place for the call dispatch logic. Wrapping keeps the public surface honest: a handler that makes no cross-service calls sees no augmentation, so `keyof ConnectumCallMap` is `never` and `ctx.call` is statically uncallable -- the correct default. The framework performs a single internal cast at mount time (the `wrapHandlers` injection point) to substitute `Context` for `HandlerContext`; this is the only public-surface cast in the design. The positional `ctx.call(method, request, options)` shape mirrors ConnectRPC's `client.method(request, options)` and Moleculer's `ctx.call(action, params, opts)`; the object-argument alternative was rejected as call-site noise.

**Consequence.** Handlers gain a uniform, type-safe cross-service call API regardless of where the target is deployed, and existing `HandlerContext` usage is preserved. The cost is one framework-owned cast and a second context type that mirrors ConnectRPC's `MethodImpl` / `ServiceImpl` (`ConnectumMethodImpl` / `ConnectumServiceImpl`).

### 2. `defineService` closure-register replacing `ServiceRoute`

A service is registered with `defineService(descriptor, handlers)` (or `defineLazyService(descriptor, factory)` for DI-heavy monoliths). Both return an opaque `ServiceDefinition`:

```ts
interface ServiceDefinition {
  readonly descriptor: DescService;
  readonly register: (router: ConnectRouter, ctx: RegisterContext) => void;
}
```

`createServer({ services })` accepts `readonly ServiceDefinition[]`. The old `ServiceRoute = (router) => void` form is **removed**.

**Rationale.** Pairing the proto `DescService` with the registration closure lets the framework build the catalog, drive `enabledServices` activation, and validate the transport without re-deriving service identity from the router. Crucially, the construction generic `S extends DescService` lives only on the `defineService` / `defineLazyService` boundary; once a service is defined, its handlers are captured inside the `register` closure and nothing generic leaks out. The framework can iterate `ServiceDefinition[]` with no variance problems. The brand-based phantom-type alternative was rejected because it would expose a public generic parameter that users would have to erase (e.g. `ServiceDefinition<DescService>`) on arrays. `ctx.call` type inference is unaffected because `ConnectumCallMap` is a global augmentation independent of `ServiceDefinition` generics. The framework supplies a `RegisterContext` (carrying `wrapHandlers`) to the closure at mount time, so `defineService` needs no server reference. `defineLazyService`'s factory runs only when the service is actually mounted locally (in `enabledServices`, or `enabledServices === undefined`), so a service routed to a remote process never instantiates its local dependencies.

**Consequence.** Removing `ServiceRoute` is a pre-publish breaking change; all existing examples migrate to `defineService(...)`. This is acceptable because nothing is published yet -- the removal would be GA-breaking if deferred past 1.0.0, so it must land before publish.

### 3. Catalog shape, augmentation maps, and code generation

The catalog is `type ServiceCatalog = Readonly<Record<string, DescService>>` -- a plain registry mapping a proto `typeName` to its descriptor. It carries no topology. Typing for `ctx.call` / `ctx.stream` comes from **two** single, global module-augmentation interfaces in `@connectum/core`: `ConnectumCallMap` (unary RPCs) and `ConnectumStreamMap` (streaming RPCs), both keyed `"<typeName>/<method>"`. Both start empty, so a project with no generated catalog still type-checks (calls are then untyped rather than a hard error).

`@connectum/protoc-gen-catalog` is a buf/protoc plugin that emits **one `catalog.gen.ts` per buf module** containing a runtime `serviceCatalog` object plus the two augmentations in one `declare module "@connectum/core"` block. The plugin classifies methods via `DescMethod.methodKind`: `unary` → `ConnectumCallMap`; `server_streaming` / `client_streaming` / `bidi_streaming` → `ConnectumStreamMap` with a kebab-cased `kind` discriminator (`"server-stream"`, `"client-stream"`, `"bidi"`).

Two code-generation invariants are mandatory:

- Every `catalog.gen.ts` emits `import type {} from "@connectum/core";`. Without it, `tsc` rejects the augmentation in cross-package builds with `TS2664: Invalid module name in augmentation`.
- The generated file must be loaded by the contracts package (re-export it from `index.ts`, or add a top-level `import "./catalog.gen.ts";`). A named-only consumer that omits this gets **silently missing keys** in `ConnectumCallMap` -- no compile error. This footgun makes the entry-point load mandatory.

The plugin is **not** a cross-package aggregator: each buf module emits its own `catalog.gen.ts`, and cross-package composition is done at runtime by the consumer via `mergeCatalogs(a, b, c)`. `mergeCatalogs` **throws** (a `CatalogConfigError`) on a duplicate `typeName`.

**Rationale.** A plain record keeps the proto contract and the runtime API 1:1 -- no aliases, no proto extensions, no DSL. A single global `ConnectumCallMap` was validated to work across npm packages (per-package maps would break consumer-side `ctx.call` type-safety). The runtime `mergeCatalogs` throw is mandatory, not an optional convenience: TypeScript does **not** catch a duplicate `typeName` when two contracts packages declare an identical-shape entry under the same key (it treats this as a redeclaration of an identical interface property and silently merges). Only a runtime check defends against a silent collision routing calls to the wrong service. Because TypeScript cannot catch identical-shape duplicates, a documented naming convention (`{org}.{team}.{domain}.v{N}.{Service}`) plus a code-review checkpoint is the recommended additional guard.

**Consequence.** Codegen plugs into the existing `buf.gen.yaml` flow and adds no runtime dependency for consumers. The single-object `serviceCatalog` does not tree-shake (a measured ~357–377 bytes per service after minification), which is the accepted cost of the single-catalog design; very large catalogs (>1000 services) should split into per-domain packages. Duplicate-typeName protection is split across a compile-time naming convention and a runtime `mergeCatalogs` throw.

### 4. RemoteResolver -- synchronous, lazy transport, cached

A `RemoteResolver` maps a remote service identity to a ConnectRPC `Transport`:

```ts
type RemoteResolver = (ctx: { typeName: string; endpoint?: string }) => Transport | null;
```

The resolver **must be synchronous** and **must not perform network I/O** (no TCP dial, no DNS lookup at resolution time). It only maps an identity to a lazily-connecting `Transport`. Returning `null` means "no route" → the call fails with `Code.Unavailable`. The framework caches the result per unique `(typeName, endpoint)` key, so the resolver runs once per distinct route. `CallOptions.endpoint` is an opaque hint the core does not interpret -- the resolver decides what it means (URL, k8s service name, sharding key). Built-in resolvers: `singleTransportResolver`, `mapResolver`, `dnsResolver`, `perServiceEnvResolver`.

**Rationale.** The transport already represents a lazy connection, so an async resolver would add an `await` to every call site for no practical gain. Synchronous resolution plus lazy transport keeps DNS and dialing off the boot critical path -- there is no startup network I/O. The object-shaped context (`{ typeName, endpoint }`) makes future field additions non-breaking. Startup validation is a **shape check only**: when a `catalog` is configured, every `enabledServices` entry must be a known catalog key, else `createServer(...).start()` throws `CatalogConfigError`. The framework does **not** probe resolvers at startup -- a resolver is not even invoked until the first `server.client()` / `ctx.call` for a remote service, so route reachability is never validated eagerly.

**Consequence.** Cold start stays fast even with a large catalog. The trade-off is that resolver/route misconfiguration is not caught at startup: a non-local service with no `remoteResolver` surfaces as `CatalogConfigError`, and a resolver returning `null` surfaces as `ConnectError(Code.Unavailable)` -- both at `server.client()` construction (or, for `ctx.call`, at dispatch). Only the catalog/`enabledServices` shape is validated eagerly.

### 5. Cascade defaults: signal, deadline, trace, headers

`ctx.call` / `ctx.stream` cascade context from the inbound request unless overridden via `CallOptions`:

- **signal** -- when `CallOptions.signal` is omitted, the inbound `ctx.signal` is injected, so cancelling the inbound RPC cancels every in-flight `ctx.call`. A supplied signal **replaces** the cascade (it is not linked with `ctx.signal`).
- **deadline** -- when `CallOptions.timeoutMs` is omitted, the remaining inbound deadline (`ctx.timeoutMs()`) is injected. A caller may **shorten** the deadline, never extend it.
- **trace** -- propagated **implicitly** by the `@connectum/otel` client interceptor mounted in `outgoingInterceptors`, which reads the active span from `AsyncLocalStorage` and emits `traceparent`. The user does not configure a trace field. `@connectum/core` stays Layer 0 and does **not** auto-instantiate OpenTelemetry -- trace propagation only happens if the user mounts the otel interceptor.
- **headers** -- opt-in. The default propagates **no** inbound headers (`propagateHeaders: []`). `defaultPropagateHeaders` (`packages/core/src/propagateHeaders.ts`) is a ready-made set containing the W3C trace-context headers (`traceparent`, `tracestate`) that a user can spread and extend. Explicit `CallOptions.headers` always take precedence over propagated values.

**Rationale.** Signal and deadline cascade make cancellation and deadline budgets correct by default -- a slow downstream cannot outlive its caller, and shorten-only deadline prevents a child from extending its parent's budget. Trace is kept implicit (and out of core) to avoid a hidden L0 dependency on OpenTelemetry and to avoid a double `traceparent`: the otel interceptor overwrites any propagated header with the active span's context, so the otel value wins. Header propagation defaults to empty to avoid two failure modes a non-empty default would introduce -- a stale parent correlation header "sticking" to an outgoing call, and a double-injection / custom-propagator conflict with the otel interceptor. `authorization` is deliberately excluded even from the convenience default, because forwarding credentials is a security-sensitive choice that must be explicit.

**Consequence.** Cancellation and deadlines are correct out of the box; distributed tracing requires mounting `@connectum/otel`; arbitrary correlation headers require an explicit `propagateHeaders` allow-list. The exact allow-list ergonomics (glob support, policy lists) were deferred to validation against the reference examples and start from the empty, lowest-risk default.

### 6. `outgoingInterceptors` typed as `@connectrpc/connect.Interceptor`

The single new client-side cross-cutting field is `outgoingInterceptors?: readonly Interceptor[]`, typed directly as `@connectrpc/connect`'s `Interceptor` -- no Connectum-specific wrapper.

**Rationale.** Every Connectum interceptor (`@connectum/interceptors`, `@connectum/otel`) is already compatible with the ConnectRPC `Interceptor` contract. Reusing that contract lets users mount existing interceptors -- and third-party ConnectRPC interceptors -- with no adapter. A wrapper would add surface area for no benefit and would block direct import of external interceptors. `clientIdentity` is intentionally **not** a separate API concept; users add identity through a closure in their own interceptor.

**Consequence.** The auth/identity copy-paste that the meshai and AnyLabel cases duplicated across files collapses into one shared interceptor chain.

### 7. Split error model

Catalog failures use two distinct error types depending on whether the fault is a developer mistake or a runtime condition (`packages/core/src/catalogErrors.ts`):

- **`CatalogConfigError extends Error`** -- a configuration mistake, detected eagerly at construction or startup. Examples: `server.client(Desc)` on a non-local service with no resolver, `enabledServices` that is not a subset of the catalog, a duplicate `typeName` during `mergeCatalogs`. It fails loud with a stack trace and a clean prototype chain across compiled targets.
- **`ConnectError`** -- an operational `ctx.call` / `ctx.stream` failure, with the appropriate Connect status code: `FailedPrecondition` (`ctx.call` / `ctx.stream` invoked when no catalog is configured), `Unimplemented` (a genuine runtime dispatch miss -- `ctx.call("unknown.Type/Method")`), `Unavailable` (resolver returned `null`), `Internal` (resolver threw).

**Rationale.** A configuration bug and a runtime RPC failure call for different handling. A stack trace is more useful than a gRPC code for a misconfiguration that should never reach production; conversely, operational failures must flow through the existing `ConnectError`-based interceptor and error-handler machinery. Reserving `Code.Unimplemented` strictly for a runtime dispatch miss keeps the two classes cleanly separable: a configuration mistake fails eagerly as a `CatalogConfigError`, a `ctx.call` against an unconfigured catalog is `FailedPrecondition`, and an unknown `typeName` at dispatch is `Unimplemented`.

**Consequence.** The error surface is slightly larger -- callers must know which operations can throw `CatalogConfigError` versus a `ConnectError` -- but the boundary between "fix your config" and "handle this at runtime" becomes unambiguous.

### 8. Streaming partial failure -- deliver-then-error

On a mid-stream transport failure, the iterator returned by `ctx.stream` delivers the messages received so far and **then** throws the terminal `ConnectError`. Messages are not silently dropped, and the error is not raised before the buffered messages are consumed.

**Rationale.** Surfacing the failure through the iterator's final error keeps the already-received data usable while still signalling failure unambiguously. Silently dropping buffered messages would hide progress; raising eagerly would discard valid data.

**Consequence.** Consumers handle a stream that may yield N valid messages and then throw. A fail-fast mode (raise immediately, discard buffered messages) is a noted future option behind an explicit opt-in, not a v1 default.

### 9. Runtime / codegen compatibility -- `.js` import extension

The buf plugin emits `.js` extensions in the relative specifiers inside `catalog.gen.ts` (`import { GreeterService } from "./greeter_pb.js";`), matching `protoc-gen-es` output (use the same `import_extension`). Pre-compiled distribution (tsup/tsc → `dist/*.js` + `dist/*.d.ts`) is the **recommended** path for published contracts packages and works across runtimes out of the box. Raw-source `.ts` distribution is supported on runtimes with native or strip-types TypeScript: Bun, Node.js 22+ (`--experimental-strip-types`), Node.js 25.2+ (native). `allowImportingTsExtensions: true` is **not** required in the typical case and is not forced by the codegen template; it remains an escape hatch for edge cases (e.g. a `verbatimModuleSyntax: true` workspace with no compile step).

**Rationale.** `.js` extensions are the minimal common denominator: they work for pre-compiled output (where `.ts` extensions would break because compiled JS cannot resolve `.ts` files) and for runtime-native TS (where the loader resolves the corresponding `.ts`). The `.ts`-extension alternative was rejected because it breaks pre-compiled distribution and forces every consumer to enable `allowImportingTsExtensions`.

**Consequence.** Generated catalogs work for both compiled and source distribution without per-consumer tsconfig changes. Deno and edge runtimes (Cloudflare Workers, Vercel Edge) are out of scope.

## Non-goals / v1 limitations

These are explicit limitations of the v1 catalog, not merely "future nice-to-haves." Documentation and the migration guide must state them.

- **Catalog versioning for mixed deployments.** During a rolling update where a new version adds or removes methods, a method missing on the old version produces `Code.Unimplemented` on the old side. The v1 coordination strategy is **forward/backward-compatible additive changes only** (add methods; do not remove or rename) until a future `catalog-versioning` change ships. This must be documented in the migration guide and the resolver-patterns guide.
- **Vendor-proto exclusion.** The plugin generates services from buf's `files-to-generate` only, with no selective skip annotation. Vendor protos land in the output if they are part of the input. The v1 workaround is a separate buf module or a manual `pick` via `mergeCatalogs`. Selective exclusion is a future enhancement.
- **Async resolvers.** The resolver is synchronous by contract (lazy transport covers the vast majority of cases). An async resolver would add an `await` to every call site and is out of v1; if a concrete use case appears, it is a separate change.
- **Hot-reload of topology.** `enabledServices` and `remoteResolver` configuration are read only at `server.start()`. Changing topology requires a restart.

## Consequences

### Positive

1. **One declarative DX layer** replaces the per-adopter boilerplate (endpoint registry, transport cache, custom resolver, per-call-site interceptor chains).
2. **Catalog-free monolith is unchanged** -- catalog, resolver, and `enabledServices` are all optional; the fintech-monolith case keeps using today's `createServer({ services })`.
3. **Type-safe cross-service calls** via positional `ctx.call` / `ctx.stream`, generated from proto, with no aliases or proto topology.
4. **Transport-transparent** -- the same call hits an in-process transport when the target is local and a resolver-supplied transport when remote, through the same interceptor chain (local↔local has parity with local↔remote).
5. **Correct cancellation and deadlines by default** via signal/deadline cascade (shorten-only deadline).
6. **No hidden L0 dependencies** -- trace stays in `@connectum/otel`; header propagation is opt-in and empty by default.
7. **Reuses the ConnectRPC `Interceptor` contract** -- existing and third-party interceptors mount with no adapter.

### Negative

1. **Pre-publish breaking removals** -- `ServiceRoute` and the `in-process-transport` `fallback` parameter are removed; all examples migrate. (Free now; GA-breaking if deferred past 1.0.0.)
2. **Larger error surface** -- callers must distinguish `CatalogConfigError` (config bug) from `ConnectError` (operational).
3. **Single-object `serviceCatalog` does not tree-shake** -- accepted cost; very large catalogs (>1000 services) should split into per-domain packages.
4. **A second context type** (`Context`, `ConnectumMethodImpl`, `ConnectumServiceImpl`) mirrors ConnectRPC's, plus one framework-owned cast at mount time.

### Risks

- **Identical-shape duplicate typeNames** are invisible to TypeScript across packages -- mitigated by the mandatory runtime `mergeCatalogs` throw plus a documented naming convention and code-review checkpoint.
- **Mixed-deployment method drift** during rolling updates surfaces as `Code.Unimplemented` -- mitigated by the additive-only coordination strategy until `catalog-versioning`, documented as a v1 limitation.
- **Endpoint-specific resolver misconfiguration** is not caught at startup (only the default route is probed) -- surfaces lazily on first endpoint-specific call; documented.

## Alternatives Considered

- **Proto extensions for deployment metadata** (`option (connectum.deployment).local = true`) -- rejected: mixes contract and topology and makes proto depend on runtime configuration.
- **Alias namespaces in the catalog** (`{ greeter: { typeName: "acme.v1.GreeterService" } }`) -- rejected: introduces proto↔runtime divergence and an extra indirection layer; the catalog stays 1:1 with proto `typeName`.
- **Async resolver** -- rejected: adds an `await` to every call site with no practical benefit since the transport is already lazy.
- **Object-argument call API** (`ctx.call({ method, request, options })`) -- rejected: noisier at the call site and diverges from the ConnectRPC client API.
- **`catalogs: ServiceCatalog[]` array** -- rejected: an internal merge is unavoidable, so `mergeCatalogs(...)` makes it explicit.
- **Per-package `ConnectumCallMap`** -- rejected after cross-package validation: a single global map merges correctly across packages, while per-package maps would break consumer-side `ctx.call` type-safety.
- **Brand-based phantom type on `ServiceDefinition`** -- rejected: exposes a public generic users must erase on arrays; the closure-register pattern removes handlers from the type entirely.
- **Connectum-specific wrapper for `outgoingInterceptors`** -- rejected: adds surface area and blocks reuse of existing ConnectRPC interceptors.
- **`.ts` import extensions in generated catalogs** -- rejected: breaks pre-compiled distribution and forces `allowImportingTsExtensions` on every consumer.

## References

1. [ADR-003: Package Decomposition](./003-package-decomposition.md) -- package structure and layer rules.
2. [ADR-023: Uniform Registration API](./023-uniform-registration-api.md) -- `createDefaultInterceptors()`, explicit interceptor control.
3. [ADR-024: Auth/Authz Strategy](./024-auth-authz-strategy.md) -- context propagation patterns.
4. [ADR-026: EventBus Architecture](./026-eventbus-architecture.md) -- the asynchronous counterpart to synchronous cross-service calls.
5. [ConnectRPC](https://connectrpc.com/) -- `HandlerContext`, `Interceptor`, `Transport`, `ConnectRouter`.
6. [protobuf-es](https://github.com/bufbuild/protobuf-es) -- `DescService`, `DescMethod`, `MessageShape`.

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-06-15 | Software Architect | Initial ADR: service catalog (declarative cross-service calls, `defineService`, resolver, cascade defaults, split error model, buf codegen) |
