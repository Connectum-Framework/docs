---
title: Configure Telemetry Exporters
description: Set OpenTelemetry resources, exporters, endpoints, and provider lifecycle.
docType: how-to
outline: deep
---

# Backends & Configuration

This guide targets the documented `1.3.x` release line. Features marked `Since
1.3.0` are not available in the published `1.2.x` packages until the 1.3.0
release; check the installed package version before using them.

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
| `OTEL_TRACES_EXPORTER` | Trace exporter | `otlp`, `otlp/http`, `otlp/http-protobuf`, `otlp/grpc`, `console`, `none` |
| `OTEL_METRICS_EXPORTER` | Metrics exporter | `otlp`, `otlp/http`, `otlp/http-protobuf`, `otlp/grpc`, `console`, `none` |
| `OTEL_LOGS_EXPORTER` | Logs exporter | `otlp`, `otlp/http`, `otlp/http-protobuf`, `otlp/grpc`, `console`, `none` |

`otlp` takes its transport and encoding from the protocol variables below and sends protobuf-encoded OTLP/HTTP when none is set, as the OpenTelemetry specification defines. `otlp/http` (JSON), `otlp/http-protobuf` and `otlp/grpc` name the transport explicitly and ignore the protocol variables. The bare `otlp` value, the protocol variables below and `otlp/http-protobuf` are available since 1.3.0; earlier versions accept only `otlp/http` and `otlp/grpc`.

### OTLP Endpoints

| Variable | Description |
|----------|-------------|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Base OTLP endpoint. OTLP/HTTP appends `/v1/traces`, `/v1/metrics` or `/v1/logs`. An empty value counts as not set |
| `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` | Traces endpoint, used as given (overrides base) |
| `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT` | Metrics endpoint, used as given (overrides base) |
| `OTEL_EXPORTER_OTLP_LOGS_ENDPOINT` | Logs endpoint, used as given (overrides base) |

With OTLP/HTTP and no endpoint variable set, the exporter sends to `http://localhost:4318/v1/<signal>`. A value that is not a URL makes the service fail when telemetry is first initialized, rather than exporting elsewhere.

The "overrides base" order holds for OTLP/HTTP. OTLP/gRPC exporters receive a set `OTEL_EXPORTER_OTLP_ENDPOINT` explicitly, so it takes precedence over the per-signal variables.

### OTLP Settings

| Variable | Description |
|----------|-------------|
| `OTEL_EXPORTER_OTLP_PROTOCOL` | Protocol for the `otlp` exporter value: `grpc`, `http/protobuf` or `http/json`. `grpc` selects OTLP/gRPC; `http/protobuf` sends protobuf-encoded OTLP/HTTP (`Content-Type: application/x-protobuf`); `http/json` sends JSON-encoded OTLP/HTTP (`Content-Type: application/json`) |
| `OTEL_EXPORTER_OTLP_TRACES_PROTOCOL`, `OTEL_EXPORTER_OTLP_METRICS_PROTOCOL`, `OTEL_EXPORTER_OTLP_LOGS_PROTOCOL` | The same for one signal (overrides the general variable) |
| `OTEL_EXPORTER_OTLP_HEADERS` | Headers (comma-separated `key=value`) |

An unrecognized protocol value is rejected when a signal set to `otlp` reads it. The explicit `otlp/http` value predates the protocol variables and keeps sending JSON; use `otlp` with `http/protobuf`, or `otlp/http-protobuf`, for the binary encoding.

### Batch Span Processor

| Variable | Default | Description |
|----------|---------|-------------|
| `OTEL_BSP_SCHEDULE_DELAY` | `1000` | Schedule delay (ms) |
| `OTEL_BSP_MAX_QUEUE_SIZE` | `1000` | Max queued spans |
| `OTEL_BSP_MAX_EXPORT_BATCH_SIZE` | `100` | Max spans per export batch |
| `OTEL_BSP_EXPORT_TIMEOUT` | `10000` | Export timeout (ms) |

Connectum passes these values to the trace provider's `BatchSpanProcessor`.
Tune them against measurements from your service and collector; Connectum has
no validated spans-per-second capacity threshold.

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

### What shutdown guarantees

Since 1.3.0, `shutdownProvider()` always releases the provider, whether stopping succeeds or fails:

- **A failing flush does not block the provider.** If an exporter cannot deliver its last batch (an unreachable collector, for example), the promise rejects with that error, but the next `getProvider()` or `initProvider()` starts from a clean state and a repeated `shutdownProvider()` is a no-op. Earlier versions kept returning the half-stopped provider and repeated the same error.
- **Every signal is stopped.** Tracing, metrics and logging are stopped independently, so a failure in one does not leave the others running. One failure is rethrown as it is; several arrive together in an `AggregateError`.
- **Global registrations are released.** The provider unregisters the OpenTelemetry API globals it took (trace, context, propagation, metrics, logs), so a provider created afterwards registers cleanly and delivers metrics. A registration that belonged to other code, such as your own `NodeSDK`, is neither taken over nor removed.
- **Interceptors keep working.** `createOtelInterceptor()` and `createOtelClientInterceptor()` created before a shutdown record into whichever provider is current.

Earlier versions left the globals registered after a shutdown, so a provider created afterwards was refused as a duplicate and its `meter` became a no-op: RPC metrics disappeared without a message.

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
