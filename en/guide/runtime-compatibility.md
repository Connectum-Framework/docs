---
outline: deep
---

# Runtime Compatibility

Connectum targets **Node.js 20+** as the primary runtime. Bun compatibility is a secondary goal -- most packages work, but some features require workarounds or have known limitations. This page documents the current state of runtime compatibility across all `@connectum/*` packages.

## Compatibility Matrix

| Package | Node.js 20 | Node.js 22 | Node.js 25 | Bun |
|---------|:----------:|:----------:|:----------:|:---:|
| `@connectum/core` | Yes | Yes | Yes | Yes |
| `@connectum/interceptors` | Yes | Yes | Yes | Yes |
| `@connectum/healthcheck` | Yes | Yes | Yes | Yes |
| `@connectum/reflection` | Yes | Yes | Yes | Yes |
| `@connectum/auth` | Yes | Yes | Yes | Yes |
| `@connectum/events` | Yes | Yes | Yes | Yes |
| `@connectum/events-nats` | Yes | Yes | Yes | Yes |
| `@connectum/events-kafka` | Yes | Yes | Yes | Yes |
| `@connectum/events-redis` | Yes | Yes | Yes | Yes |
| `@connectum/events-amqp` | Yes | Yes | Yes | Yes |
| `@connectum/otel` | Yes | Yes | Yes | Partial |
| `@connectum/cli` | Yes | Yes | Yes | Yes |
| `@connectum/testing` | Yes | Yes | Yes | Partial |

**Legend:** Yes = fully supported, Partial = works with limitations (see details below).

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

Bun does not fully support the `node:http2` client API. Calling `createGrpcTransport()` or `createConnectTransport({ httpVersion: '2' })` from `@connectrpc/connect-node` throws a `TypeError` at runtime.

**Workaround:** use `createConnectTransport()` with `httpVersion: '1.1'` (the default):

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

::: warning Limitations on Bun
- **No native gRPC protocol** -- only the Connect protocol (JSON/Protobuf over HTTP/1.1) is available
- **No HTTP/2 multiplexing** -- each request opens a separate connection
- **Server must support Connect protocol** -- Connectum servers support it by default alongside gRPC
:::

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

In Bun, streaming RPCs over `createConnectTransport()` from `@connectrpc/connect-node` may fail because the Node.js HTTP adapter does not work correctly in Bun's `node:http` compatibility layer. The solution is to build a transport that uses `globalThis.fetch` directly:

```typescript
import { createClient } from '@connectrpc/connect';
import { createTransport } from '@connectrpc/connect/protocol-connect';
import { createFetchClient } from '@connectrpc/connect/protocol';
import { MonitorService } from '#gen/monitor/v1/monitor_pb.js';

// Use Bun's native fetch implementation
const transport = createTransport({
  baseUrl: 'http://localhost:5000',
  fetch: createFetchClient(globalThis.fetch),
  useBinaryFormat: true,
});

const client = createClient(MonitorService, transport);

// Server streaming -- uses Bun's native fetch with ReadableStream
for await (const event of client.watchEvents({ filter: 'error' })) {
  console.log(`Event: ${event.type} -- ${event.message}`);
}
```

::: tip Cross-Runtime Helper
You can create a helper function that selects the right transport based on the runtime:

```typescript
import { createConnectTransport } from '@connectrpc/connect-node';

function createClientTransport(baseUrl: string) {
  // Bun sets globalThis.Bun
  if (typeof globalThis.Bun !== 'undefined') {
    // Dynamic import to avoid loading connect/protocol-connect on Node.js
    const { createTransport } = await import('@connectrpc/connect/protocol-connect');
    const { createFetchClient } = await import('@connectrpc/connect/protocol');
    return createTransport({
      baseUrl,
      fetch: createFetchClient(globalThis.fetch),
      useBinaryFormat: true,
    });
  }

  return createConnectTransport({
    baseUrl,
    httpVersion: '2',
  });
}
```
:::

## Testing Utilities {#testing}

`@connectum/testing` provides helpers like `createMockNext()` for testing interceptors. These helpers use the `node:test` mock API (`mock.fn()`), which is not available in Bun.

### Node.js

```typescript
import { describe, it, mock } from 'node:test';
import { createMockNext, createMockRequest } from '@connectum/testing';

describe('my interceptor', () => {
  it('calls next', async () => {
    const next = createMockNext(); // Uses mock.fn() from node:test
    await myInterceptor(createMockRequest(), next);
    // assert next was called
  });
});
```

### Bun

Replace `createMockNext()` with Bun's built-in mock:

```typescript
import { describe, it, mock } from 'bun:test';
import { createMockRequest } from '@connectum/testing';

describe('my interceptor', () => {
  it('calls next', async () => {
    const next = mock(() => Promise.resolve({ message: {} }));
    await myInterceptor(createMockRequest(), next);
    // assert next was called
  });
});
```

::: info Future Improvement
A portable mock implementation that works across both `node:test` and `bun:test` is planned. Track progress in `@connectum/testing` package updates.
:::

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
| `createGrpcTransport()` throws TypeError | Bun | Open (Bun) | Use `createConnectTransport()` with HTTP/1.1 |
| `createConnectTransport({ httpVersion: '2' })` throws TypeError | Bun | Open (Bun) | Omit `httpVersion` or set to `'1.1'` |
| Streaming RPC fails with Node.js HTTP adapter | Bun | Open (Bun) | Use `createTransport` + `createFetchClient(globalThis.fetch)` |
| `node:test` mock API unavailable | Bun | By design | Use `bun:test` mock directly |
| OpenTelemetry auto-instrumentation | Bun | Open (OTel) | Use manual instrumentation |

## Related

- [Runtime Support](/en/guide/typescript/runtime-support) -- how each runtime executes TypeScript and loads `@connectum/*` packages
- [Service Communication](/en/guide/service-communication) -- client transport configuration and patterns
- [Testing](/en/guide/testing) -- scenario-based API testing
- [@connectum/testing](/en/packages/testing) -- Package Guide
- [@connectum/otel](/en/packages/otel) -- Package Guide
