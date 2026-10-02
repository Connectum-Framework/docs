---
outline: deep
---

# Backends & Configuration

Configure OpenTelemetry exporters, provider management, and integration with observability backends like Jaeger and Grafana.

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

## Provider Management

The OTel provider initializes lazily when you first call `getProvider()`, `getTracer()`, `getMeter()`, or `getLogger()`. For explicit control:

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

`initProvider()` applies its options only when no provider exists yet. Once
`getProvider()`, `getTracer()`, `getMeter()`, or `getLogger()` has created the
provider from environment defaults, a later `initProvider()` call does nothing.
Call it at startup, before any instrumentation code runs.

### Access the provider

`getProvider()` returns the provider that `initProvider()`, `getTracer()`,
`getMeter()`, and `getLogger()` from `@connectum/otel` share, typed as
`OtelProvider`, and creates it from environment defaults if needed. The provider
exposes the `tracer`, `meter`, and `logger` bound to the service name and
version, plus `shutdown()`. `getTracer()`, `getMeter()`, and `getLogger()` read
the same provider.

Use `getProvider()` when one component needs all three signals or must be handed
the provider explicitly. Since 1.3.0 the `OtelProvider` type is exported, so you
can name it in a field or parameter. It is an interface only: the provider is
created by `initProvider()` or `getProvider()`, never with a constructor.

```typescript
import { getProvider, type OtelProvider } from '@connectum/otel';

function createOrderTelemetry(provider: OtelProvider) {
  const recorded = provider.meter.createCounter('orders.recorded');

  return {
    recordOrder(): void {
      provider.tracer.startActiveSpan('order.record', (span) => {
        recorded.add(1);
        span.end();
      });
    },
  };
}

const telemetry = createOrderTelemetry(getProvider());
```

`provider.shutdown()` shuts down the trace, metric, and log providers it
created, but keeps the instance: `getProvider()` keeps returning the stopped provider. To shut down at
process exit, call `shutdownProvider()` instead. It shuts the provider down and
clears it, so the next `getProvider()` or `initProvider()` creates a new one.

See [`OtelProvider`](/en/api/@connectum/otel/provider/interfaces/OtelProvider)
and [`getProvider`](/en/api/@connectum/otel/provider/functions/getProvider) for
the exact types.

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

## Related

- [Observability Overview](/en/guide/observability) -- back to overview
- [Tracing](/en/guide/observability/tracing) -- server/client interceptors
- [Metrics](/en/guide/observability/metrics) -- custom metrics
- [Logging](/en/guide/observability/logging) -- structured logging
- [Docker Deployment](/en/guide/production/docker) -- containerized setup
- [@connectum/otel](/en/packages/otel) -- Package Guide
- [@connectum/otel API](/en/api/@connectum/otel/) -- Full API Reference
