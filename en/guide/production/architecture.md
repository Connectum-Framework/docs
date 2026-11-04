---
title: Connectum Runtime Architecture
description: Understand the service-process boundary, shared RPC path, extension seams and local or remote catalog routing.
docType: concept
outline: deep
---

<script setup>
import GuideOverview from '../../../.vitepress/theme/components/GuideOverview.vue';
import overview from '../../../.vitepress/theme/assets/diagrams/guide/architecture.html?raw';
</script>

# Connectum Runtime Architecture

`createServer()` composes one service process: typed services, protocol plugins,
request middleware, a network listener and a coordinated startup and shutdown
lifecycle. A process can host several service `typeName` values. Deployment
infrastructure connects to that process through explicit interfaces.

<figure class="technical-diagram" data-guide-overview="architecture" aria-label="One process and its extension seams">
<GuideOverview :source="overview" />
<figcaption>createServer() owns one process. Catalog, EventBus and OTel are explicit additions; the bus can stay in memory. Protocol HTTP fallbacks sit outside the RPC chain. External infrastructure is selected independently.</figcaption>
</figure>

<span id="inside-and-outside"></span>

## Boundary and ownership

Connectum owns transport selection, route registration, RPC dispatch, the
ordered server-interceptor chain and the `Context` supplied to typed handlers.
It coordinates startup, request drain and shutdown. Catalog dispatch, EventBus
integration and telemetry are capabilities the application supplies explicitly.

The gateway, service mesh, scheduler, registry, message broker and telemetry
backend remain outside this boundary. They are not framework prerequisites.
Exact configuration fields belong to the [generated core API](/en/api/@connectum/core/).

## Build-time inputs

Proto schemas, generated service descriptors and the optional generated service
catalog define the contracts consumed by route and catalog registration. They
are build-time inputs, not stages that execute for every RPC. They therefore
sit outside the runtime paths in the diagrams.

Use [Scaffolding](/en/guide/scaffolding) for the generation workflow.

## Runtime composition

Inbound RPC requests follow one shared execution path. `TransportManager` owns
the selected Node transport; `buildRoutes()` composes services and protocol
registrations. The configured server interceptors wrap the matched route, which
invokes a typed handler with a Connectum `Context`.

Protocol modules such as Health Check and Reflection register additional RPC
routes through the same router contract. Their optional HTTP handlers, such as
`/healthz`, run through the adapter fallback, outside the RPC interceptor chain.

<RuntimeCompositionDiagram />

### Network and in-process parity

An in-process client opens no socket. `createLocalTransport()` uses
`createRouterTransport(routes)` with the same `serverInterceptors` before
reaching the handler. Client-side interceptors may additionally wrap that call.

The shared route and interceptor boundary is the parity invariant: application
behavior should not depend on whether a locally mounted service was reached
over HTTP or through the in-process transport. The
[In-Process Transport guide](/en/guide/production/in-process-transport) defines
the exact guarantee, limitations and test utilities.

## Catalog call routing

With a service catalog configured, handlers use `ctx.call` and `ctx.stream` for
typed service calls. The per-server catalog dispatcher resolves the method and
builds the outgoing call frame from the current handler context:

1. A locally mounted `typeName` uses the in-process transport and re-enters the
   server's routes, interceptors and typed handler chain.
2. A target not mounted locally goes to `remoteResolver`, which supplies a
   ConnectRPC `Transport`. For a remote Connectum server, the call crosses the
   process boundary and enters its `connectNodeAdapter({ routes, interceptors })`.

<CatalogRoutingDiagram />

The incoming cancellation signal cascades to catalog calls unless replaced in
call options. The timeout is clamped to the remaining incoming deadline: an
override can shorten it but cannot extend it. Inbound headers are not forwarded
implicitly; only configured allow-listed headers and explicit call headers
propagate.

A process that makes no typed cross-service calls does not need a catalog.
The [Service Catalog guide](/en/guide/service-communication/service-catalog) owns
configuration and error semantics; [Remote Resolvers](/en/guide/service-communication/resolvers)
explains transport resolution. To choose between synchronous calls and
asynchronous events, use [Communication](/en/guide/service-communication/choosing-a-mechanism).

## Extension seams

Each optional capability attaches at a defined point:

| Capability | Runtime attachment | External dependency |
|---|---|---|
| Server interceptors | Ordered ConnectRPC request chain | Optional identity, policy, or application services |
| Protocol plugins | Register RPC routes and optional HTTP fallbacks | Protocol-specific clients and tooling |
| Service catalog | Typed `ctx.call` / `ctx.stream` dispatch | Resolver-supplied remote transports |
| EventBus | Supplied to `createServer()`; the server starts and stops it | None for Memory; NATS, Kafka, Redis, or AMQP broker otherwise |
| OpenTelemetry | Server/client interceptors and an explicitly configured provider | OTLP collector or console exporter |

Install and compose only the modules the service needs. OpenTelemetry
instrumentation does not make the telemetry backend part of the process;
similarly, managing an EventBus lifecycle does not start its external broker.

## Deployment boundary

Deployment determines how the process is packaged, scheduled and exposed:

- [Docker](/en/guide/production/docker) packages the process.
- [Kubernetes](/en/guide/production/kubernetes) schedules it and drives probes.
- [Envoy Gateway](/en/guide/production/envoy-gateway) provides an optional edge
  and REST transcoding path.
- [Service Mesh](/en/guide/production/service-mesh) provides optional traffic
  policy and workload mTLS.
- [Observability](/en/guide/observability) selects telemetry signals and backends.

<span id="go-deeper"></span>

## Related

- [Server](/en/guide/server): composition and lifecycle setup.
- [Transport Matrix](/en/guide/production/transport-matrix): HTTP/1.1, h2c,
  TLS/ALPN and RPC-kind support.
- [Package decomposition ADR](/en/contributing/adr/003-package-decomposition):
  package-boundary rationale. The [ADR index](/en/contributing/adr/) records the
  other architecture decisions.
