---
title: '@connectum/otel'
description: OpenTelemetry instrumentation for Connectum -- tracing, metrics, and logging
---

# @connectum/otel

Full OpenTelemetry instrumentation for Connectum services. Provides ConnectRPC interceptors for server and client tracing/metrics, a correlated logger, deep tracing helpers (`traced`, `traceAll`), and OTLP exporter management. Follows [OpenTelemetry semantic conventions for RPC](https://opentelemetry.io/docs/specs/semconv/rpc/connect-rpc/).

**Layer**: 0 (Independent Core)

## Installation

```bash
pnpm add @connectum/otel
```

**Requires**: Node.js 18+

## Quick Start

```typescript
import { createServer } from '@connectum/core';
import { createOtelInterceptor, initProvider } from '@connectum/otel';

// Initialize provider (optional -- lazy-initialized from env by default)
initProvider({ serviceName: 'my-service' });

const server = createServer({
  services: [routes],
  interceptors: [
    createOtelInterceptor({ serverPort: 5000 }),
  ],
});

await server.start();
```

## API Reference

### Server Interceptor

#### `createOtelInterceptor(options?)`

Creates a ConnectRPC interceptor that instruments incoming RPC calls with OpenTelemetry tracing and metrics.

```typescript
function createOtelInterceptor(options?: OtelInterceptorOptions): Interceptor;
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `withoutTracing` | `boolean` | `false` | Disable span creation (metrics only) |
| `withoutMetrics` | `boolean` | `false` | Disable metric recording (tracing only) |
| `filter` | `OtelFilter` | -- | Filter callback to skip specific RPCs |
| `attributeFilter` | `OtelAttributeFilter` | -- | Filter to exclude specific attributes |
| `recordMessages` | `boolean` | `false` | Include message content in span events (may contain sensitive data) |
| `trustRemote` | `boolean` | `false` | Use extracted remote context as parent span |
| `serverAddress` | `string` | `os.hostname()` | Override `server.address` attribute |
| `serverPort` | `number` | -- | Opt-in `server.port` attribute |

```typescript
const interceptor = createOtelInterceptor({
  serverPort: 5000,
  filter: ({ service }) => !service.includes('Health'),
  trustRemote: false, // creates root spans with links to remote context
});
```

### Client Interceptor

#### `createOtelClientInterceptor(options)`

Creates a ConnectRPC interceptor for outgoing client RPC calls.

```typescript
function createOtelClientInterceptor(options: OtelClientInterceptorOptions): Interceptor;
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `serverAddress` | `string` | **(required)** | Target server address |
| `serverPort` | `number` | -- | Target server port |
| `withoutTracing` | `boolean` | `false` | Disable span creation |
| `withoutMetrics` | `boolean` | `false` | Disable metric recording |
| `filter` | `OtelFilter` | -- | Filter callback |
| `attributeFilter` | `OtelAttributeFilter` | -- | Attribute filter |
| `recordMessages` | `boolean` | `false` | Record message content |

### Deep Tracing Helpers

#### `traced(fn, options?)`

Wraps a single function in an OpenTelemetry span. Preserves the original type signature. Supports sync and async functions.

```typescript
function traced<T extends (...args: any[]) => any>(fn: T, options?: TracedOptions): T;
```

```typescript
import { traced } from '@connectum/otel';

const findUser = traced(async (id: string) => {
  return await db.users.findById(id);
}, {
  name: 'UserService.findUser',
  recordArgs: true,
  argsFilter: (args) => args.map(a => typeof a === 'string' ? a : '[redacted]'),
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | `string` | `fn.name` or `"anonymous"` | Span name |
| `recordArgs` | `boolean \| string[]` | `false` | Record function arguments |
| `argsFilter` | `ArgsFilter` | -- | Transform/mask recorded args |
| `attributes` | `Record<string, string \| number \| boolean>` | -- | Custom span attributes |

#### `traceAll(obj, options?)`

Proxy-based wrapper that instruments all methods of an object. Returns a proxy that creates spans for each method call.

```typescript
function traceAll<T extends object>(obj: T, options?: TraceAllOptions): T;
```

```typescript
import { traceAll } from '@connectum/otel';

const userRepo = traceAll(new UserRepository(), {
  prefix: 'UserRepository',
  exclude: ['toString'],
  recordArgs: false,
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prefix` | `string` | `constructor.name` or `"Object"` | Span name prefix |
| `include` | `string[]` | -- | Whitelist of methods to wrap |
| `exclude` | `string[]` | -- | Blacklist of methods to exclude |
| `recordArgs` | `boolean \| string[]` | `false` | Record method arguments |
| `argsFilter` | `MethodArgsFilter` | -- | Transform/mask recorded args |

### Logger

#### `getLogger(name?, options?)`

Returns a correlated logger that automatically enriches log records with the active `trace_id` and `span_id`.

```typescript
function getLogger(name?: string, options?: LoggerOptions): Logger;
```

```typescript
import { getLogger } from '@connectum/otel';

const log = getLogger('my-service');

log.info('User created', { userId: '123' });
log.warn('Rate limit approaching');
log.error('Database connection failed', { db: 'primary' });
log.debug('Cache hit');
```

```typescript
interface Logger {
  info(message: string, attributes?: AnyValueMap): void;
  warn(message: string, attributes?: AnyValueMap): void;
  error(message: string, attributes?: AnyValueMap): void;
  debug(message: string, attributes?: AnyValueMap): void;
  emit(record: LogRecord): void;
}
```

### Provider Management

#### `initProvider(options?)`

Explicitly initialize the OpenTelemetry provider. Must be called before any telemetry is emitted if custom configuration is needed.

```typescript
function initProvider(options?: ProviderOptions): void;
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `serviceName` | `string` | `OTEL_SERVICE_NAME` or `npm_package_name` | Override service name |
| `serviceVersion` | `string` | `npm_package_version` | Override service version |
| `settings` | `Partial<OTLPSettings>` | env-based | Override OTLP settings |

#### `getProvider()`

Returns the current provider instance. Lazily creates one with default (environment-based) configuration if not yet initialized.

```typescript
function getProvider(): OtelProvider;
```

#### `shutdownProvider()`

Gracefully shuts down all OTLP providers and releases resources.

```typescript
async function shutdownProvider(): Promise<void>;
```

### Standalone Instances

```typescript
import { getTracer, getMeter } from '@connectum/otel';

const tracer = getTracer();  // Lazy-initialized Tracer
const meter = getMeter();    // Lazy-initialized Meter
```

### RPC Metrics

```typescript
import { createRpcServerMetrics, createRpcClientMetrics } from '@connectum/otel';

const serverMetrics = createRpcServerMetrics(meter);
// serverMetrics.callDuration  -- rpc.server.call.duration (seconds)
// serverMetrics.requestSize   -- rpc.server.request.size (bytes)
// serverMetrics.responseSize  -- rpc.server.response.size (bytes)

const clientMetrics = createRpcClientMetrics(meter);
// clientMetrics.callDuration  -- rpc.client.call.duration (seconds)
// clientMetrics.requestSize   -- rpc.client.request.size (bytes)
// clientMetrics.responseSize  -- rpc.client.response.size (bytes)
```

## Configuration

### Environment Variables

| Variable | Values | Default | Description |
|----------|--------|---------|-------------|
| `OTEL_SERVICE_NAME` | string | `npm_package_name` | Service name for all telemetry |
| `OTEL_TRACES_EXPORTER` | `console \| otlp/http \| otlp/grpc \| none` | -- | Trace exporter type |
| `OTEL_METRICS_EXPORTER` | `console \| otlp/http \| otlp/grpc \| none` | -- | Metric exporter type |
| `OTEL_LOGS_EXPORTER` | `console \| otlp/http \| otlp/grpc \| none` | -- | Log exporter type |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | URL | -- | Collector endpoint (e.g. `http://localhost:4318`) |
| `OTEL_BSP_MAX_EXPORT_BATCH_SIZE` | number | `100` | Max spans per export batch |
| `OTEL_BSP_MAX_QUEUE_SIZE` | number | `1000` | Max queue size (drops when full) |
| `OTEL_BSP_SCHEDULE_DELAY` | number (ms) | `1000` | Auto-export interval |
| `OTEL_BSP_EXPORT_TIMEOUT` | number (ms) | `10000` | Export operation timeout |

### `ExporterType`

```typescript
const ExporterType = {
  CONSOLE: 'console',
  OTLP_HTTP: 'otlp/http',
  OTLP_GRPC: 'otlp/grpc',
  NONE: 'none',
} as const;
```

## Semantic Conventions

Exported attribute constants for manual instrumentation:

```typescript
import {
  ATTR_RPC_SYSTEM,
  ATTR_RPC_SERVICE,
  ATTR_RPC_METHOD,
  ATTR_RPC_CONNECT_RPC_STATUS_CODE,
  ATTR_SERVER_ADDRESS,
  ATTR_SERVER_PORT,
  ATTR_ERROR_TYPE,
  RPC_SYSTEM_CONNECT_RPC,
} from '@connectum/otel';
```

## Exports Summary

| Export | Subpath | Description |
|--------|---------|-------------|
| `createOtelInterceptor` | `.` / `./interceptor` | Server-side RPC interceptor |
| `createOtelClientInterceptor` | `.` / `./client-interceptor` | Client-side RPC interceptor |
| `traced` | `.` / `./traced` | Function-level tracing wrapper |
| `traceAll` | `.` / `./traceAll` | Object-level tracing proxy |
| `getLogger` | `.` / `./logger` | Correlated logger |
| `getTracer`, `getMeter` | `.` / `./tracer`, `./meter` | Standalone OTel instances |
| `initProvider`, `getProvider`, `shutdownProvider` | `.` / `./provider` | Provider lifecycle |
| `createRpcServerMetrics`, `createRpcClientMetrics` | `.` / `./metrics` | RPC metric factories |
| `ATTR_*`, `ConnectErrorCode`, etc. | `.` / `./attributes` | Semantic conventions |
| `ExporterType`, `getOTLPSettings`, etc. | `.` / `./config` | Configuration utilities |

## Related Packages

- **[@connectum/core](./core.md)** -- Server where the interceptor runs
- **[@connectum/interceptors](./interceptors.md)** -- Complementary resilience interceptors
