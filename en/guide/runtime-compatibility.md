---
title: Runtime Compatibility
description: Compare package runtime requirements with tested Node.js and Bun behavior.
docType: reference
outline: deep
---

# Runtime Compatibility

Published `@connectum/*` packages declare Node.js `>=22.13.0` in their package
manifests. The framework repository itself requires Node.js `>=26.0.0` for development.
CI runs the framework test matrix on Node.js 24 and 26, and tests the HTTP/2 client
boundary on Bun 1.2.6 and the current Bun release. Those are separate contracts: the
framework's development floor does not raise the published packages' engine requirement.

::: tip Runtime switcher
Pages that show runtime-specific commands have a **Node.js | Bun** switch in the
navigation bar (and next to each affected block). This page deliberately shows both
runtimes side by side.
:::

::: tip Scaffolding emits runtime-appropriate defaults
`connectum init --runtime bun` (see [Scaffolding a Service](/en/guide/scaffolding)) emits
Bun-appropriate defaults — the `bun test` runner and the in-process `createLocalClient`
test transport, which opens no socket and behaves identically on both runtimes. The CLI
itself is exercised on Node.js, so run it with `npx` even inside a Bun project.
:::

## Runtime requirements and CI coverage {#compatibility-matrix}

| Use | Version requirement or tested boundary | Evidence |
|-----|----------------------------------------|----------|
| Run published framework packages on Node.js | `>=22.13.0` | Each published package manifest declares this `engines.node` floor. |
| Develop in the framework repository | `>=26.0.0` | The workspace manifest declares this floor. |
| Run package tests in framework CI on Node.js | 24 and 26 | CI's Node.js test matrix; the workspace development engine remains `>=26.0.0`. |
| Run generated TypeScript directly with Node.js | `>=25.2.0` with `--node-exec raw` | The CLI's generated engine range and runtime option. |
| Run generated TypeScript with Node.js and tsx | `>=22.13.0` with `--node-exec tsx` | The CLI's generated engine range and runtime option. |
| Use the HTTP/2 client on Bun | `>=1.2.6` | CI checks the floor version and a `latest` Bun channel; the full suite runs on the `latest` channel. |

For observed client behavior, see [HTTP/2 Client Transport](#http2-client). Each example
may set a higher runtime floor for its own source, so check its `package.json` before
choosing a runtime. The CLI itself is exercised on Node.js only; run it with `npx` even
when the generated project targets Bun.

## HTTP/2 Client Transport {#http2-client}

### Node.js

On Node.js, HTTP/2 gRPC clients work out of the box with `createGrpcTransport()`:

```typescript
import { createClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { GreeterService } from '#gen/greeter/v1/greeter_pb.js';

const transport = createGrpcTransport({
  baseUrl: 'http://localhost:5000',
  httpVersion: '2',
});

const client = createClient(GreeterService, transport);
const res = await client.sayHello({ name: 'Alice' });
```

This uses Node.js native `node:http2` module for full HTTP/2 multiplexing.

### Bun

**Bun >= 1.2.6 needs no special client code** -- the snippet above works unchanged. Unary,
server-streaming and bidi-streaming calls over `createGrpcTransport()` and
`createConnectTransport({ httpVersion: '2' })` all complete, and status codes carried in
HTTP/2 trailers arrive intact.

Bun's `node:http2` **client** was incomplete before 1.2.6: on those versions the transport
is constructed without error and the **first RPC hangs** -- the call never completes and
no error is thrown. Bun 1.2.6 rewrote the `node:http2` client and closed this.

::: warning Bun <= 1.2.5
Upgrade Bun. If you cannot, the only working option is `createConnectTransport()` over
HTTP/1.1 (the default `httpVersion`):

```typescript
import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-node';
import { GreeterService } from '#gen/greeter/v1/greeter_pb.js';

const transport = createConnectTransport({
  baseUrl: 'http://localhost:5000',
  // httpVersion defaults to '1.1' -- omit or set explicitly
});

const client = createClient(GreeterService, transport);
const res = await client.sayHello({ name: 'Alice' });
```

That path carries unary and server-streaming calls but **not bidi streaming**, gives up
HTTP/2 multiplexing, and requires the server to accept HTTP/1.1 (`allowHTTP1: true`, the
default). Connectum servers speak the Connect protocol alongside gRPC, so no server change
is needed.
:::

**Servers are unaffected on every Bun version.** A Connectum server -- including plaintext
h2c (`allowHTTP1: false`) -- serves HTTP/2 correctly; the limitation was always client-side.

## Streaming RPC {#streaming}

### Node.js

On Node.js, both unary and streaming RPCs work with `createGrpcTransport()` or `createConnectTransport()`:

```typescript
import { createClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { MonitorService } from '#gen/monitor/v1/monitor_pb.js';

const transport = createGrpcTransport({
  baseUrl: 'http://localhost:5000',
  httpVersion: '2',
});

const client = createClient(MonitorService, transport);

// Server streaming -- works with any transport
for await (const event of client.watchEvents({ filter: 'error' })) {
  console.log(`Event: ${event.type} -- ${event.message}`);
}
```

### Bun

The same code runs on Bun -- **no runtime branching is needed**, and Connectum itself
contains none.

- **Server streaming** works on every Bun version tested, over both HTTP/2 and HTTP/1.1
  transports.
- **Bidi streaming** requires HTTP/2, and therefore Bun >= 1.2.6 for the client. This is a
  protocol constraint, not a Bun one: bidi streaming is impossible over HTTP/1.1 on any
  runtime, and Connectum refuses to start a server that hosts bidi methods on plaintext
  HTTP/1.1 (`CONNECTUM_UNSUPPORTED_STREAMING_TRANSPORT`).

::: warning Do not hand-build a fetch transport
Earlier revisions of this page suggested `createTransport()` from
`@connectrpc/connect/protocol-connect` together with `createFetchClient(globalThis.fetch)`.
Do not use that pattern: `createTransport` is marked internal by ConnectRPC and is not
covered by semantic versioning, and on Bun 1.1.x it silently drops the request body.
:::

## Testing Utilities {#testing}

`@connectum/testing` provides mock helpers including `createMockNext()`, `createMockNextError()`, `createMockNextSlow()`, and `createMockFn()`. Their implementation does not import `node:test`; this alone does not establish support for every test runner or runtime.

```typescript
import { describe, it } from 'node:test'; // or 'bun:test'
import { createMockNext, createMockRequest } from '@connectum/testing';

describe('my interceptor', () => {
  it('calls next', async () => {
    const next = createMockNext();
    await myInterceptor(createMockRequest(), next);
    // next.mock.callCount() === 1
  });
});
```

`createMockFn()` is API-compatible with the subset of `node:test`'s `mock.fn()` that the testing helpers rely on (`.mock.calls`, `.mock.callCount()`), so assertions written against one runtime work on the other. Full API: [@connectum/testing](/en/packages/testing).

The `@connectum/testing/parity` subpath registers a `node:test` test
(`transportParityTest`) and therefore runs on Node.js only. The mock helpers shown above
are separate from that subpath.

## OpenTelemetry {#otel}

`@connectum/otel` uses the OpenTelemetry SDK packages declared by the module. Node.js is
covered by the package test suite. The framework's Bun CI matrix skips `@connectum/otel`,
so this project does not publish a Bun compatibility claim for its tracing, metrics, or
logging behavior. The package does not include `@opentelemetry/auto-instrumentations-node`;
validate any separately installed auto-instrumentation against your runtime.

::: warning
If you use `@connectum/otel` on Bun, test the specific exporter and instrumentation
packages in your application. This repository does not validate that combination.
:::

## Known Issues {#known-issues}

| Issue | Runtime | Status | Workaround |
|-------|---------|--------|------------|
| HTTP/2 client transports (`createGrpcTransport()`, `createConnectTransport({ httpVersion: '2' })`) hang on the first RPC | Bun <= 1.2.5 | **Fixed in Bun 1.2.6** | Upgrade Bun; on older Bun use `createConnectTransport()` over HTTP/1.1 (no bidi) |
| `node:test` mock API unavailable | Bun | By design | Use `bun:test` mock directly |
| `@connectum/testing/parity` requires `node:test` | Bun | Node.js test registration | Use the main entry point in Bun tests; run parity tests on Node.js |
| `@connectum/cli` is exercised on Node.js only | Bun | Open | Run the CLI with `npx`; generated code is unaffected |
| `@connectum/otel` runtime behavior | Bun | Not covered by this project's Bun test suite | Validate the selected exporters and instrumentation in your application |

## Related

- [Runtime Support](/en/guide/typescript/runtime-support) -- how each runtime executes TypeScript and loads `@connectum/*` packages
- [Service Communication](/en/guide/service-communication) -- client transport configuration and patterns
- [Testing](/en/guide/testing) -- scenario-based API testing
- [@connectum/testing](/en/packages/testing) -- Package Guide
- [@connectum/otel](/en/packages/otel) -- Package Guide
