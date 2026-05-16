---
title: In-Process Transport
description: Call locally registered Connectum services as plain function invocations — no HTTP/2, TLS, or wire serialization — with full behavioural parity to the HTTP transport.
---

# In-Process Transport

The **in-process transport** lets you invoke services that are registered on the same `Server` instance as direct function calls — without HTTP/2, TLS, sockets, or wire serialization — while preserving 1-to-1 behavioural parity with the HTTP/Connect/gRPC transport (interceptors, validation, authorization, error mapping, streaming semantics, OpenTelemetry spans and metrics).

::: tip Full API Reference
TypeScript API documentation: [@connectum/core API Reference](/en/api/@connectum/core/).
:::

## Overview

A typical Connectum service-to-service call goes over HTTP/2 loopback even when both endpoints live in the same Node.js process. That adds TLS handshakes, h2 framing, JSON/protobuf wire encoding, and a port binding — overhead that is pure waste for co-located services.

The in-process transport reuses the `ConnectRouter` that `createServer()` has already built and dispatches client calls directly to the registered handlers. The client API is identical to a remote ConnectRPC client (`createClient(Service, transport)`), so the same caller code works whether the callee is local or remote.

**When to use:**

- **Modular monolith** — multiple bounded contexts hosted in a single process call each other over typed RPC contracts without the network overhead.
- **Backend-for-Frontend (BFF)** — a BFF process embeds upstream services for low-latency composition.
- **Tests** — exercise the full server-side interceptor chain (validation, auth, OTEL) without binding ports.
- **Polyglot deployment** — a single client codebase that automatically routes to a local registered service or falls back to a remote HTTP transport based on the runtime topology.

**When NOT to use:**

- **Cross-process calls** — use `createGrpcTransport` / `createConnectTransport` over HTTP/2. The in-process transport is, by design, single-process only.
- **HTTP-level middleware** — CORS, compression, and similar wire-level concerns do not apply because no data leaves the process.

## Quick Start

```typescript
import { createServer } from '@connectum/core';
import { GreeterService } from './gen/greeter_pb.js';
import { greeterRoutes } from './greeter.js';

const server = createServer({
  services: [greeterRoutes],
});

// Auto-routing: resolved via the in-process service registry,
// no server.start() required.
const greeter = server.client(GreeterService);

const { message } = await greeter.sayHello({ name: 'world' });
console.log(message); // "Hello, world!"
```

The call above executes the full server-side interceptor chain (including validation and authorization) and emits the same OpenTelemetry CLIENT and SERVER spans as an equivalent HTTP call — only the `connectum.transport` attribute differs.

## API Reference

### `server.client(service, options?)`

Auto-routing client factory. Resolves the transport via the server's internal **service registry**:

- If the service is registered on this `Server` (`server.hasService(service)` returns `true`) — returns an in-process client that dispatches directly to the registered handler.
- Otherwise, if `options.fallback` is provided — returns a standard ConnectRPC client over the fallback transport.
- Otherwise — throws `ConnectError(unimplemented)` immediately at client construction (fail-fast), naming the service `typeName`.

```typescript
function client<T extends DescService>(
  service: T,
  options?: { fallback?: Transport },
): Client<T>;
```

This is the recommended entry point: the same call site works for both in-process and remote deployments without modification.

```typescript
import { createGrpcTransport } from '@connectrpc/connect-node';

const remoteFallback = createGrpcTransport({
  baseUrl: process.env.UPSTREAM_URL!,
  httpVersion: '2',
});

// Local if registered on `server`, remote otherwise.
const inventory = server.client(InventoryService, { fallback: remoteFallback });
```

### `server.localClient(service)`

Low-level helper that always returns an in-process client. Requires the service to be registered on the server — otherwise the first call throws `ConnectError(unimplemented)`.

```typescript
function localClient<T extends DescService>(service: T): Client<T>;
```

### `createLocalTransport(server, options?)`

Lowest-level primitive. Returns a ConnectRPC `Transport` bound to the server's router. Use this directly when you need multiple clients with different client-side interceptor stacks over the same server.

```typescript
function createLocalTransport(
  server: Server,
  options?: { interceptors?: Interceptor[] },
): Transport;
```

The returned transport behaves like `createRouterTransport` from `@connectrpc/connect` but is wired into the Connectum server lifecycle and the same router that `server.start()` would expose over HTTP.

### `server.hasService(desc)`

Synchronous registry lookup by `desc.typeName`.

```typescript
function hasService(desc: DescService): boolean;
```

Useful for conditional routing in user code (e.g. when you build a custom transport selector).

## Behavioural Parity Guarantees

The in-process transport is validated by a cross-transport contract test suite (`transportParityTest` driver in `@connectum/testing`). For every covered scenario, the observed result over `createLocalTransport(server)` is structurally identical to the result over `createGrpcTransport({ baseUrl })` — modulo a single allow-listed attribute / label (`connectum.transport` / `transport`).

Guaranteed identical between in-process and HTTP:

- **Server-side interceptor chain** — same interceptors, same order. There is no API to bypass interceptors on the local path.
- **Validation** — proto-declared `buf.validate` / `protovalidate` rules reject invalid requests with `ConnectError(invalid_argument)` and identical violation details on both transports.
- **Authorization** — proto-declared authz rules and `@connectum/auth` interceptors apply uniformly. Missing/invalid tokens produce `ConnectError(unauthenticated)`; insufficient scope produces `ConnectError(permission_denied)` with identical metadata.
- **Error mapping** — `ConnectError` (`code`, `message`, `metadata`, `details`) round-trips identically. Plain `Error` becomes `code === internal` on both paths.
- **Streaming** — unary, server-stream, client-stream, and bidi RPCs preserve message order and respect `AbortSignal` cancellation on both paths.
- **Headers / metadata** — `Headers` objects (including `authorization` and `@connectum/auth` serialized auth headers) round-trip in both directions. Headers are cloned at the boundary to prevent cross-side mutation.
- **OpenTelemetry tracing and metrics** — see [Observability](#observability) below.

## Observability

`@connectum/otel` instruments the in-process path through the same hooks as HTTP:

- **Client span**: `SpanKind.CLIENT`, name `${rpc.service}/${rpc.method}`, attributes `rpc.system`, `rpc.service`, `rpc.method`, `rpc.grpc.status_code`, plus `connectum.transport="in-process"`.
- **Server span**: `SpanKind.SERVER` with the same attribute set; established as a **child** of the client span via W3C Trace Context (`traceparent` / `tracestate`) carried through the in-memory `Headers`.
- **Stream events**: `message.sent` and `message.received` are recorded on streaming spans identically to HTTP.
- **Metrics**: `rpc.client.duration`, `rpc.server.duration`, `rpc.client.request.size`, `rpc.client.response.size`, `rpc.server.request.size`, `rpc.server.response.size`, and error counters are emitted with the same instrument names and label keys. Payload sizes are computed on the serialized protobuf form so they are directly comparable with HTTP. The only difference is an extra label `transport=in-process` (vs `transport=http`).

Dashboards, alerts, and SLOs built over HTTP metrics continue to work after a service migrates to in-process invocation.

## Limitations

By design, the in-process transport bypasses HTTP-wire concerns:

- **No HTTP-level middleware** — CORS, compression, HTTP/2 flow control, request body size limits, and similar features do not apply because no bytes leave the process.
- **No cross-process / IPC** — for cross-process communication (Unix sockets, separate hosts, worker_threads) use HTTP transports.
- **Streaming back-pressure** is provided by `AsyncIterable` semantics and is best-effort rather than HTTP/2 flow control. For very high-throughput streaming, prefer HTTP/2.
- **Payload objects are shared by reference** inside the same process (as in any function call). Do not mutate request/response payloads after handing them off. `Headers` are explicitly cloned at the boundary.

## Coexistence with HTTP

A single `Server` instance can simultaneously serve HTTP clients (after `server.start()`) and in-process clients (available immediately after `createServer()`). Both paths go through the same router and the same interceptor chain, so an interceptor observes both kinds of calls uniformly.

```typescript
const server = createServer({ services: [routes] });

// In-process client works immediately, no socket bound.
const local = server.client(MyService);
await local.doWork({ /* ... */ });

// Bind HTTP/2 socket for external clients.
await server.start();

// HTTP and in-process clients can be used concurrently.
```

If you do not call `server.start()`, no port is bound and `server.address` remains `null` — useful for tests and embedded use cases.

## Polyglot Deployment Pattern

The auto-routing `server.client()` enables a single caller codebase that works in both monolithic and distributed deployments.

```typescript
// shared/clients.ts — same code in every deployment topology
export function buildClients(server: Server, env: { upstreamUrl?: string }) {
  const fallback = env.upstreamUrl
    ? createGrpcTransport({ baseUrl: env.upstreamUrl, httpVersion: '2' })
    : undefined;

  return {
    inventory: server.client(InventoryService, { fallback }),
    pricing: server.client(PricingService, { fallback }),
  };
}
```

- **Monolith deployment**: register `InventoryService` and `PricingService` on the same `server`. Both clients route locally.
- **Distributed deployment**: register only the services owned by this process. Others fall back to the remote transport. No change at the call site.
- **Hybrid migration**: extract one service at a time. The client side never changes.

If a service is not registered locally and no fallback is provided, `server.client()` throws `ConnectError(unimplemented)` at construction — a fail-fast signal that deployment topology is misconfigured.

## Testing

`@connectum/testing` ships dedicated helpers for in-process testing:

- **`createLocalClient(server, service)`** — concise client for unit and integration tests without binding ports.
- **`transportParityTest(name, scenario)`** — driver that runs a single declarative scenario against both `createGrpcTransport({ baseUrl })` and `createLocalTransport(server)` and structurally diffs the observable outcome (response payload, headers, `ConnectError` fields, OTEL spans modulo `connectum.transport`, metrics modulo `transport` label). Any divergence fails the test.
- **In-memory OTEL collectors** — `SpanExporter` and `MetricReader` helpers used by the parity driver for assertion on tracing and metrics output.

Use the parity driver to guarantee that custom interceptors and proto-declared rules behave identically across transports:

```typescript
import { transportParityTest } from '@connectum/testing';

await transportParityTest('greeter.sayHello rejects empty name', {
  // build the client over the provided transport
  client: (transport) => createClient(GreeterService, transport),
  // run the scenario and return observable outcome
  scenario: async (client) => client.sayHello({ name: '' }),
  expect: {
    error: { code: 'invalid_argument' },
  },
});
```

See [@connectum/testing](/en/packages/testing) for the full API.

## See Also

- [@connectum/core — In-Process Transport](/en/packages/core#in-process-transport)
- [@connectum/otel](/en/packages/otel) — `connectum.transport` attribute and `transport` metric label
- [@connectum/testing](/en/packages/testing) — `createLocalClient`, `transportParityTest`
- [Microservice Architecture Patterns](/en/guide/production/architecture)
- [API Reference: @connectum/core](/en/api/@connectum/core/)
