---
outline: deep
---

# Runtime Compatibility

Connectum targets **Node.js 22+** as the primary runtime and is exercised on Bun in CI on
every pull request. This page documents the current state of runtime compatibility across
all `@connectum/*` packages.

::: tip Runtime switcher
Pages that show runtime-specific commands have a **Node.js | Bun** switch in the
navigation bar (and next to each affected block). This page deliberately shows both
runtimes side by side.
:::

## Compatibility Matrix

| Package | Node.js 22 | Node.js 25 | Bun >= 1.2.6 |
|---------|:----------:|:----------:|:------------:|
| `@connectum/core` | Yes | Yes | Yes |
| `@connectum/interceptors` | Yes | Yes | Yes |
| `@connectum/healthcheck` | Yes | Yes | Yes |
| `@connectum/reflection` | Yes | Yes | Yes |
| `@connectum/auth` | Yes | Yes | Yes |
| `@connectum/events` | Yes | Yes | Yes |
| `@connectum/events-nats` | Yes | Yes | Yes |
| `@connectum/events-kafka` | Yes | Yes | Yes |
| `@connectum/events-redis` | Yes | Yes | Yes |
| `@connectum/events-amqp` | Yes | Yes | Yes |
| `@connectum/otel` | Yes | Yes | Partial |
| `@connectum/cli` | Yes | Yes | Partial |
| `@connectum/testing` | Yes | Yes | Partial |

**Legend:** Yes = fully supported, Partial = works with limitations (see details below).

**Bun floor:** HTTP/2 client transports require **Bun >= 1.2.6** (see
[HTTP/2 Client Transport](#http2-client)); the examples repository pins Bun >= 1.3.6.
`@connectum/cli` is exercised on Node.js only -- run it with `npx` even in a Bun project.

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

`@connectum/testing` is a public, production-ready package. Its mock helpers -- including `createMockNext()`, `createMockNextError()`, `createMockNextSlow()`, and the underlying `createMockFn()` spy -- are implemented on top of a portable spy factory that does **not** depend on `node:test`, so the same test code runs on Node.js, Bun, Deno, and bundler environments.

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

The package is marked **Partial** on Bun for one reason: the `@connectum/testing/parity`
subpath registers a `node:test` test (`transportParityTest`) and therefore runs on Node.js
only. The main entry point has no such dependency.

## OpenTelemetry {#otel}

`@connectum/otel` depends on the official `@opentelemetry/*` SDK packages, which use `node:perf_hooks`, `node:diagnostics_channel`, and other Node.js-specific APIs.

| Feature | Node.js | Bun |
|---------|:-------:|:---:|
| Tracing (spans) | Yes | Partial -- basic spans work, some auto-instrumentation may fail |
| Metrics | Yes | Partial -- manual metrics work, automatic HTTP metrics may not |
| Logging | Yes | Yes |
| Auto-instrumentation | Yes | No -- `@opentelemetry/auto-instrumentations-node` is not compatible |

::: warning
If you use `@connectum/otel` on Bun, test your specific instrumentation setup thoroughly. Manual instrumentation (explicit span creation) is more reliable than auto-instrumentation on Bun.
:::

## Known Issues {#known-issues}

| Issue | Runtime | Status | Workaround |
|-------|---------|--------|------------|
| HTTP/2 client transports (`createGrpcTransport()`, `createConnectTransport({ httpVersion: '2' })`) hang on the first RPC | Bun <= 1.2.5 | **Fixed in Bun 1.2.6** | Upgrade Bun; on older Bun use `createConnectTransport()` over HTTP/1.1 (no bidi) |
| `node:test` mock API unavailable | Bun | By design | Use `bun:test` mock directly |
| `@connectum/testing/parity` requires `node:test` | Bun | By design | Use the main entry point; run parity tests on Node.js |
| `@connectum/cli` is exercised on Node.js only | Bun | Open | Run the CLI with `npx`; generated code is unaffected |
| OpenTelemetry auto-instrumentation | Bun | Open (OTel) | Use manual instrumentation |

## Related

- [Runtime Support](/en/guide/typescript/runtime-support) -- how each runtime executes TypeScript and loads `@connectum/*` packages
- [Service Communication](/en/guide/service-communication) -- client transport configuration and patterns
- [Testing](/en/guide/testing) -- scenario-based API testing
- [@connectum/testing](/en/packages/testing) -- Package Guide
- [@connectum/otel](/en/packages/otel) -- Package Guide
