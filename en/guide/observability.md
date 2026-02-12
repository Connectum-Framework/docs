---
title: Observability
description: Add distributed tracing, metrics, and structured logging to your Connectum services with OpenTelemetry.
outline: deep
---

# Observability

Connectum provides first-class OpenTelemetry support through the `@connectum/otel` package. It includes distributed tracing, metrics collection, structured logging, and deep instrumentation of your business logic.

## Installation

```bash
pnpm add @connectum/otel
```

Peer dependencies (installed automatically):

```bash
pnpm add @opentelemetry/api @opentelemetry/sdk-node
```

## Quick Setup

### Server-Side Tracing

Add the OpenTelemetry interceptor to trace all incoming RPC calls:

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';
import { createOtelInterceptor } from '@connectum/otel';
import routes from '#gen/routes.js';

const server = createServer({
  services: [routes],
  port: 5000,
  protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
  interceptors: [
    createOtelInterceptor({
      // Skip health check calls from trace output
      filter: ({ service }) => !service.includes('grpc.health'),
    }),
  ],
});

server.on('ready', () => {
  healthcheckManager.update(ServingStatus.SERVING);
});

await server.start();
```

### Environment Configuration

Configure OpenTelemetry entirely through environment variables:

```bash
# .env

# Service metadata
OTEL_SERVICE_NAME=greeter-service
OTEL_SERVICE_VERSION=1.0.0
OTEL_SERVICE_NAMESPACE=production

# Trace exporter
OTEL_TRACES_EXPORTER=otlp
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:4318/v1/traces

# Metrics exporter
OTEL_METRICS_EXPORTER=otlp
OTEL_EXPORTER_OTLP_METRICS_ENDPOINT=http://localhost:4318/v1/metrics

# Logs exporter
OTEL_LOGS_EXPORTER=otlp
OTEL_EXPORTER_OTLP_LOGS_ENDPOINT=http://localhost:4318/v1/logs

# OTLP protocol
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
```

## Tracing

### Server Interceptor

`createOtelInterceptor()` automatically creates spans for all incoming RPC calls with OpenTelemetry semantic conventions:

```typescript
import { createOtelInterceptor } from '@connectum/otel';

const interceptor = createOtelInterceptor({
  filter: ({ service }) => !service.includes('grpc.health'),
  serverPort: 5000,
  recordMessages: false,     // Include request/response in span events
  trustRemote: false,        // Use extracted remote context as parent
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `filter` | `OtelFilter` | -- | Skip specific requests from tracing |
| `serverAddress` | `string` | `os.hostname()` | Override server address attribute |
| `serverPort` | `number` | -- | Add server port attribute |
| `recordMessages` | `boolean` | `false` | Include request/response bodies in spans |
| `trustRemote` | `boolean` | `false` | Use remote context as parent span |
| `withoutTracing` | `boolean` | `false` | Disable tracing (metrics only) |
| `withoutMetrics` | `boolean` | `false` | Disable metrics (tracing only) |
| `attributeFilter` | `OtelAttributeFilter` | -- | Exclude specific span attributes |

### Client Interceptor

For outgoing RPC calls, use `createOtelClientInterceptor()` to propagate trace context:

```typescript
import { createConnectTransport } from '@connectrpc/connect-node';
import { createClient } from '@connectrpc/connect';
import { createOtelClientInterceptor } from '@connectum/otel';
import { UserService } from '#gen/user_pb.js';

const transport = createConnectTransport({
  baseUrl: 'http://user-service:5001',
  interceptors: [
    createOtelClientInterceptor({
      serverAddress: 'user-service',   // Required
      serverPort: 5001,
    }),
  ],
});

const client = createClient(UserService, transport);
```

The client interceptor:
- Injects trace context into outgoing requests via `propagation.inject()`
- Creates `SpanKind.CLIENT` spans
- Records `rpc.client.*` metrics

### Deep Tracing with `traced()`

Wrap individual functions to create spans for your business logic:

```typescript
import { traced } from '@connectum/otel';

const findUser = traced(async (id: string) => {
  return await db.users.findById(id);
}, {
  name: 'UserRepository.findUser',
  recordArgs: true,         // Record function arguments as span attributes
});

// Each call creates a span: "UserRepository.findUser"
const user = await findUser('123');
```

### Deep Tracing with `traceAll()`

Wrap all methods of an object via Proxy:

```typescript
import { traceAll } from '@connectum/otel';

class OrderRepository {
  async findById(id: string) {
    return await db.orders.findById(id);
  }

  async create(data: OrderData) {
    return await db.orders.create(data);
  }

  async updateStatus(id: string, status: string) {
    return await db.orders.update(id, { status });
  }
}

// Auto-instrument all methods (does NOT mutate the original)
const repository = traceAll(new OrderRepository(), {
  prefix: 'OrderRepository',
  exclude: ['internalHelper'],
  recordArgs: true,
});

// Calls automatically create spans:
// "OrderRepository.findById", "OrderRepository.create", etc.
await repository.findById('order-123');
```

::: tip Performance
`traceAll()` uses ES6 Proxy and creates method wrappers lazily on first access. It prevents double-wrapping automatically.
:::

## Metrics

### Using getMeter()

`getMeter()` returns a lazy singleton OpenTelemetry meter:

```typescript
import { getMeter } from '@connectum/otel';

const meter = getMeter();

// Counter
const requestCounter = meter.createCounter('http.requests.total', {
  description: 'Total number of requests',
  unit: '1',
});
requestCounter.add(1, { method: 'GET', status: 200 });

// Histogram
const latencyHistogram = meter.createHistogram('request.duration', {
  description: 'Request duration in milliseconds',
  unit: 'ms',
});
latencyHistogram.record(125.5, { method: 'GET' });

// UpDown Counter (for gauges like active connections)
const activeConnections = meter.createUpDownCounter('connections.active');
activeConnections.add(1);   // Connection opened
activeConnections.add(-1);  // Connection closed

// Observable Gauge (pulled on export)
meter.createObservableGauge('memory.heap_used', {
  description: 'Heap memory usage',
  unit: 'bytes',
}).addCallback((result) => {
  result.observe(process.memoryUsage().heapUsed);
});
```

### RPC Metrics (Automatic)

The OTel interceptors automatically record standard RPC metrics:

**Server metrics** (via `createOtelInterceptor`):
- `rpc.server.duration` -- request duration histogram
- `rpc.server.request.size` -- request message size
- `rpc.server.response.size` -- response message size

**Client metrics** (via `createOtelClientInterceptor`):
- `rpc.client.duration` -- request duration histogram
- `rpc.client.request.size` -- request message size
- `rpc.client.response.size` -- response message size

## Logging

### Using getLogger()

`getLogger()` provides structured logging with OpenTelemetry integration:

```typescript
import { getLogger } from '@connectum/otel';

const logger = getLogger('OrderService');

// Console-like convenience methods
logger.info('Order created', { orderId: '123', userId: 'user-456' });
logger.warn('Low stock', { sku: 'ABC', remaining: 2 });
logger.error('Payment failed', { error: 'timeout', orderId: '123' });
logger.debug('Processing step', { step: 3, total: 5 });
```

### Default Attributes

Add attributes that appear in every log entry:

```typescript
const logger = getLogger('PaymentService', {
  defaultAttributes: {
    'service.layer': 'domain',
    env: 'production',
  },
});

logger.info('Charge created');
// Attributes: { "logger.name": "PaymentService", "service.layer": "domain", env: "production" }
```

### Raw OpenTelemetry LogRecord

For advanced use cases, emit raw OTel log records:

```typescript
import { SeverityNumber } from '@opentelemetry/api-logs';

logger.emit({
  severityNumber: SeverityNumber.INFO,
  severityText: 'INFO',
  body: 'Custom log record',
  attributes: { custom: true },
  timestamp: Date.now(),
});
```

::: info Trace correlation
When an active span exists, the OpenTelemetry SDK automatically includes `trace_id` and `span_id` in log records. No manual correlation needed.
:::

## Distributed Tracing Across Services

A complete example showing trace context propagation between two services:

```typescript
// ---- Service A (Gateway) ----
import { createServer } from '@connectum/core';
import { createConnectTransport } from '@connectrpc/connect-node';
import { createClient } from '@connectrpc/connect';
import { createOtelInterceptor, createOtelClientInterceptor } from '@connectum/otel';
import { UserService } from '#gen/user_pb.js';
import gatewayRoutes from '#gen/routes.js';

// Server: trace incoming requests
const server = createServer({
  services: [gatewayRoutes],
  port: 5000,
  interceptors: [
    createOtelInterceptor({
      serverPort: 5000,
      filter: ({ service }) => !service.includes('grpc.health'),
    }),
  ],
});

// Client: propagate trace context to Service B
const transport = createConnectTransport({
  baseUrl: 'http://user-service:5001',
  interceptors: [
    createOtelClientInterceptor({
      serverAddress: 'user-service',
      serverPort: 5001,
    }),
  ],
});

const userClient = createClient(UserService, transport);

// Trace context flows automatically:
// Service A (server span) -> Service A (client span) -> Service B (server span)
```

## Provider Management

The OTel provider initializes lazily when you first call `getTracer()`, `getMeter()`, or `getLogger()`. For explicit control:

```typescript
import { initProvider, shutdownProvider } from '@connectum/otel';

// Explicit initialization (optional)
initProvider({
  serviceName: 'my-service',
  serviceVersion: '1.0.0',
});

// Graceful shutdown (flush pending telemetry)
server.onShutdown('otel', async () => {
  await shutdownProvider();
});
```

## Environment Variables Reference

### Service Metadata

| Variable | Description |
|----------|-------------|
| `OTEL_SERVICE_NAME` | Service name (required) |
| `OTEL_SERVICE_VERSION` | Service version |
| `OTEL_SERVICE_NAMESPACE` | Service namespace (e.g., `production`) |

### Exporters

| Variable | Description | Values |
|----------|-------------|--------|
| `OTEL_TRACES_EXPORTER` | Trace exporter | `otlp`, `console`, `none` |
| `OTEL_METRICS_EXPORTER` | Metrics exporter | `otlp`, `console`, `none` |
| `OTEL_LOGS_EXPORTER` | Logs exporter | `otlp`, `console`, `none` |

### OTLP Endpoints

| Variable | Description |
|----------|-------------|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Base OTLP endpoint |
| `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` | Traces endpoint (overrides base) |
| `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT` | Metrics endpoint (overrides base) |
| `OTEL_EXPORTER_OTLP_LOGS_ENDPOINT` | Logs endpoint (overrides base) |

### OTLP Settings

| Variable | Description |
|----------|-------------|
| `OTEL_EXPORTER_OTLP_PROTOCOL` | Protocol: `http/protobuf` or `grpc` |
| `OTEL_EXPORTER_OTLP_HEADERS` | Headers (comma-separated `key=value`) |

### Batch Span Processor

| Variable | Default | Description |
|----------|---------|-------------|
| `OTEL_BSP_SCHEDULE_DELAY` | `5000` | Schedule delay (ms) |
| `OTEL_BSP_MAX_QUEUE_SIZE` | `2048` | Max queue size |
| `OTEL_BSP_MAX_EXPORT_BATCH_SIZE` | `512` | Max batch size |
| `OTEL_BSP_EXPORT_TIMEOUT` | `30000` | Export timeout (ms) |

### Instrumentations

| Variable | Description |
|----------|-------------|
| `OTEL_NODE_DISABLED_INSTRUMENTATIONS` | Comma-separated list of disabled auto-instrumentations |

## Development vs Production Configuration

### Development

Use console exporters for immediate visibility:

```bash
OTEL_SERVICE_NAME=greeter-service
OTEL_TRACES_EXPORTER=console
OTEL_METRICS_EXPORTER=none
OTEL_LOGS_EXPORTER=console
```

### Production

Export to an OTLP-compatible collector (Jaeger, Grafana Tempo, Datadog):

```bash
OTEL_SERVICE_NAME=greeter-service
OTEL_SERVICE_VERSION=1.0.0
OTEL_SERVICE_NAMESPACE=production

OTEL_TRACES_EXPORTER=otlp
OTEL_METRICS_EXPORTER=otlp
OTEL_LOGS_EXPORTER=otlp

OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf

OTEL_BSP_SCHEDULE_DELAY=5000
OTEL_BSP_MAX_QUEUE_SIZE=2048

OTEL_NODE_DISABLED_INSTRUMENTATIONS=fs,dns
```

## Integration with Backends

### Jaeger

```yaml
# docker-compose.yml
services:
  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686"   # Jaeger UI
      - "4318:4318"     # OTLP HTTP
```

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

### Grafana (Tempo + Prometheus + Loki)

```bash
# Traces -> Tempo
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://tempo:4318/v1/traces

# Metrics -> Prometheus (via OTLP)
OTEL_EXPORTER_OTLP_METRICS_ENDPOINT=http://prometheus:4318/v1/metrics

# Logs -> Loki (via OTLP)
OTEL_EXPORTER_OTLP_LOGS_ENDPOINT=http://loki:4318/v1/logs
```

## Next Steps

- [Health Checks](/en/guide/health-checks) -- configure health monitoring
- [Graceful Shutdown](/en/guide/graceful-shutdown) -- flush telemetry on shutdown
- [Interceptors](/en/guide/interceptors) -- customize the interceptor chain
- [Quickstart](/en/guide/quickstart) -- complete tutorial
