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
