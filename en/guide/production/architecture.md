---
title: Connectum Runtime Architecture
description: Understand the Connectum service-process boundary, shared RPC path, extension seams, and local or remote catalog routing.
docType: concept
outline: deep
---

# Connectum Runtime Architecture

Connectum is a modular service runtime, not a deployment platform. Its central
composition boundary is `createServer()`: it registers routes, protocols, and
interceptors; selects the network transport; and coordinates startup, drain, and
shutdown for one service process.

This page explains the runtime relationships that matter when extending or
operating that process. Exact configuration fields remain in the
[generated core API](/en/api/@connectum/core/), while deployment products and
platforms remain in their focused guides.

## Boundary and ownership

The framework owns the behavior inside a Connectum service process:

- transport selection and server lifecycle;
- registration of typed services and protocol plugins;
- the ordered server-interceptor chain;
- the `Context` supplied to typed handlers;
- local or remote service-call dispatch when a catalog is configured;
- lifecycle integration for an explicitly supplied EventBus.

Connectum does not own a gateway, service mesh, scheduler, message broker, or
telemetry backend. Those systems connect through documented seams and can be
selected independently.

## Runtime composition

Every inbound network request follows one shared execution path.
`TransportManager` owns the selected Node transport, `buildRoutes()` composes
services and protocol registrations, the configured server interceptors run in
order, and the matched route invokes a typed handler with a Connectum `Context`.

Protocol modules such as Health Check and Reflection register additional routes
through the same router contract. EventBus and OpenTelemetry are opt-in
capabilities: the server coordinates the supplied EventBus lifecycle, while OTel
instrumentation attaches through server/client interceptors and its provider.

<RuntimeCompositionDiagram />

### Network and in-process parity

An in-process client does not open a socket. `createLocalTransport()` calls
`createRouterTransport(routes)` and supplies the same `serverInterceptors`
before reaching the handler. Client-side interceptors may additionally wrap the
in-memory call.

This shared route and interceptor boundary is the parity invariant: application
behavior should not depend on whether a locally mounted service was reached over
HTTP or through the in-process transport. See
[In-Process Transport](/en/guide/production/in-process-transport) for the exact
guarantee, limitations, and test utilities.

## Catalog call routing

Handlers use the generated service catalog through `ctx.call` and `ctx.stream`.
The per-server catalog dispatcher resolves the typed method and builds the
outgoing call frame from the current handler context.

Routing then depends on where the target service is mounted:

1. A locally mounted `typeName` uses the in-process transport and re-enters the
   same process's `routes`, server interceptors, and typed handler chain. One
   `createServer()` instance may register several service `typeName` values.
2. A service not mounted locally is passed to `remoteResolver`, which supplies
   the ConnectRPC `Transport` used for the remote call. The request then crosses
   the process boundary and enters the remote server through its resolver-supplied
   `Transport` and `connectNodeAdapter({ routes, interceptors })`.

The incoming cancellation signal and remaining deadline cascade to catalog
calls unless the caller supplies a stricter override. Inbound headers are not
forwarded implicitly; only configured allow-listed headers and explicit call
headers are propagated.

<CatalogRoutingDiagram />

The catalog is optional. A service process that hosts everything locally and
makes no typed cross-service calls does not need one. Configuration and error
semantics are owned by the [Service Catalog guide](/en/guide/service-communication/service-catalog),
with resolver construction covered by [Remote Resolvers](/en/guide/service-communication/resolvers).

## Extension seams

| Capability | Runtime attachment | External dependency |
|---|---|---|
| Server interceptors | Ordered ConnectRPC request chain | Optional identity, policy, or application services |
| Protocol plugins | Register RPC routes and optional HTTP fallbacks | Protocol-specific clients and tooling |
| Service catalog | Adds typed `ctx.call` / `ctx.stream` dispatch | Resolver-supplied remote transports |
| EventBus | Supplied to `createServer()` and started/stopped with it | None for Memory; NATS, Kafka, Redis, or AMQP broker otherwise |
| OpenTelemetry | Server/client interceptors plus provider | OTLP collector or console exporter |

These are explicit capabilities rather than hidden runtime defaults. Install and
compose only the modules required by the service.

## Deployment boundary

Gateways, service meshes, Kubernetes, registries, and telemetry backends surround
the process but are not framework prerequisites. Their placement depends on the
deployment topology rather than on `createServer()` internals:

- [Docker](/en/guide/production/docker) packages the process;
- [Kubernetes](/en/guide/production/kubernetes) schedules it and drives probes;
- [Envoy Gateway](/en/guide/production/envoy-gateway) provides an optional edge and REST transcoding path;
- [Service Mesh](/en/guide/production/service-mesh) provides optional traffic policy and workload mTLS;
- [Observability](/en/guide/observability) selects telemetry signals and backends.

## Build-time inputs

Proto schemas, generated service descriptors, and the optional generated service
catalog are build-time inputs to this runtime. They are deliberately outside the
process diagrams: they define and generate the contracts consumed by route and
catalog registration, but they do not execute in the request path.

Start with [Scaffolding](/en/guide/scaffolding) for generation workflow and
[Service Communication](/en/guide/service-communication) for choosing between
synchronous catalog calls and asynchronous events.

## Related

- [Server](/en/guide/server) — composition and lifecycle entry point
- [Transport Matrix](/en/guide/production/transport-matrix) — HTTP/1.1, h2c, TLS/ALPN, and RPC-kind support
- [Choosing a Communication Mechanism](/en/guide/service-communication/choosing-a-mechanism) — synchronous calls, events, and durable workflows
- [Package decomposition ADR](/en/contributing/adr/003-package-decomposition) — package-boundary rationale
