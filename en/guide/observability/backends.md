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
| `OTEL_SERVICE_NAME` | Optional service name; see the resolution order below |
| `OTEL_RESOURCE_ATTRIBUTES` | Comma-separated resource attributes, including `service.version` and `service.namespace`; its `service.name` entry is a fallback for the service name |
| `OTEL_SERVICE_INSTANCE_ID` | Sets `service.instance.id` on the resource; the `instanceId` provider option takes precedence |

The service name is the first of these that is set and non-empty: the `serviceName`
provider option, `OTEL_SERVICE_NAME`, the `service.name` entry of
`OTEL_RESOURCE_ATTRIBUTES`, `npm_package_name`, then `unknown-service`. Since 1.3.0,
`OTEL_SERVICE_NAME` outranks the `OTEL_RESOURCE_ATTRIBUTES` entry, as the OpenTelemetry
SDK specification requires; before, the entry silently replaced it.

Connectum reads `OTEL_SERVICE_NAME`, but does not read dedicated
`OTEL_SERVICE_VERSION` or `OTEL_SERVICE_NAMESPACE` variables. The version
defaults to `npm_package_version`, then `0.0.0`. Set additional resource
attributes with `OTEL_RESOURCE_ATTRIBUTES` or `ProviderOptions.resourceAttributes`.

Since 1.3.0, keys and values in `OTEL_RESOURCE_ATTRIBUTES` are percent-decoded, as the OpenTelemetry Resource SDK specification requires: write a comma as `%2C` and an equals sign as `%3D`, so `OTEL_RESOURCE_ATTRIBUTES=team=a%2Cb` sets `team` to `a,b`. A `+` stays a `+`. When a part is not valid percent-encoding (a lone `%`, for example), the whole variable is discarded and one process warning (code `CONNECTUM_OTEL_INVALID_ENV`) is emitted when the provider is created; write a literal percent sign as `%25`. Earlier versions did not decode, so `a%2Cb` stayed `a%2Cb`.

### Exporters

| Variable | Description | Values |
|----------|-------------|--------|
| `OTEL_TRACES_EXPORTER` | Trace exporter | `otlp`, `otlp/http`, `otlp/http-protobuf`, `otlp/grpc`, `console`, `none` |
| `OTEL_METRICS_EXPORTER` | Metrics exporter | `otlp`, `otlp/http`, `otlp/http-protobuf`, `otlp/grpc`, `console`, `none` |
| `OTEL_LOGS_EXPORTER` | Logs exporter | `otlp`, `otlp/http`, `otlp/http-protobuf`, `otlp/grpc`, `console`, `none` |

`otlp` takes its transport and encoding from the protocol variables below and sends protobuf-encoded OTLP/HTTP when none is set, as the OpenTelemetry specification defines. `otlp/http` (JSON), `otlp/http-protobuf` and `otlp/grpc` name the transport explicitly and ignore the protocol variables. The bare `otlp` value, the protocol variables below and `otlp/http-protobuf` are available since 1.3.0; earlier versions accept only `otlp/http` and `otlp/grpc`.

**The default is `console`.** When a variable is unset, empty or ignored, that signal is written to standard output. The OpenTelemetry specification names `otlp` as the default, so a service that sets no `OTEL_*` variable behaves differently from the specification: nothing is sent to a collector until you set `OTEL_TRACES_EXPORTER=otlp` (and the metrics and logs equivalents). Use `none` to turn a signal off.

Since 1.3.0, values are read as the specification asks:

- An empty value is the same as an unset one.
- Values are matched case-insensitively, so `OTLP/GRPC` works.
- A value that is not in the table (`otlp,console`, `jaeger`, `zipkin`, `logging`, a typo) is ignored with a Node.js process warning, code `CONNECTUM_OTEL_INVALID_ENV`, that names the variable and the rejected value; the default applies to that signal. A comma-separated list of exporters is not supported. Reading the variables never throws, so a wrong value cannot make an RPC fail. Earlier versions threw when the provider was created, which happens on the first instrumented call, and every call after it ended with `internal error`.

The warning appears once, when the provider is created. Node.js prints it to standard error by default; listen with `process.on('warning', …)` to route it elsewhere.

### OTLP Endpoints

| Variable | Description |
|----------|-------------|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Base OTLP endpoint. OTLP/HTTP appends `/v1/traces`, `/v1/metrics` or `/v1/logs`. An empty value counts as not set |
| `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` | Traces endpoint, used as given (overrides base) |
| `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT` | Metrics endpoint, used as given (overrides base) |
| `OTEL_EXPORTER_OTLP_LOGS_ENDPOINT` | Logs endpoint, used as given (overrides base) |

With OTLP/HTTP and no endpoint variable set, the exporter sends to `http://localhost:4318/v1/<signal>`.

Since 1.3.0, an endpoint that the exporter cannot use is reported when the provider is created, with a process warning (code `CONNECTUM_OTEL_INVALID_ENV`, naming the variable and the value), and is ignored. OTLP/HTTP needs an `http:` or `https:` URL: `localhost:4318` is not one, and neither is text that is not a URL. For an ignored per-signal endpoint the base endpoint applies, and without one the exporter default. OTLP/gRPC also takes a bare `host:port` (`localhost:4317`); only text that is not a URL is ignored there. Earlier versions did not check: `localhost:4318` was accepted and failed only when `shutdownProvider()` rejected with `Protocol "localhost:" not supported`, and a value that is not a URL made creating the provider throw.

The "overrides base" order holds for OTLP/HTTP. OTLP/gRPC exporters receive a set `OTEL_EXPORTER_OTLP_ENDPOINT` explicitly, so it takes precedence over the per-signal variables.

### OTLP Settings

| Variable | Description |
|----------|-------------|
| `OTEL_EXPORTER_OTLP_PROTOCOL` | Protocol for the `otlp` exporter value: `grpc`, `http/protobuf` or `http/json`. `grpc` selects OTLP/gRPC; `http/protobuf` sends protobuf-encoded OTLP/HTTP (`Content-Type: application/x-protobuf`); `http/json` sends JSON-encoded OTLP/HTTP (`Content-Type: application/json`) |
| `OTEL_EXPORTER_OTLP_TRACES_PROTOCOL`, `OTEL_EXPORTER_OTLP_METRICS_PROTOCOL`, `OTEL_EXPORTER_OTLP_LOGS_PROTOCOL` | The same for one signal (overrides the general variable) |
| `OTEL_EXPORTER_OTLP_HEADERS` | Headers (comma-separated `key=value`) |

An empty protocol variable is the same as an unset one and values are case-insensitive. Since 1.3.0, an unrecognized protocol value is ignored with a process warning (code `CONNECTUM_OTEL_INVALID_ENV`) when a signal set to `otlp` reads it: the general variable applies, then the default `http/protobuf`. Earlier versions threw, which failed every instrumented call. The explicit `otlp/http` value predates the protocol variables and keeps sending JSON; use `otlp` with `http/protobuf`, or `otlp/http-protobuf`, for the binary encoding.

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

A value that is not an integer, or is negative, is ignored: Connectum emits a
Node.js process warning (code `CONNECTUM_OTEL_INVALID_ENV`) naming the variable
and the rejected value, and uses the default from the table. The OpenTelemetry
specification asks for the same behaviour for invalid numeric variables. Older
versions threw when the provider was created, which happens on the first traced
call.

### Fixed export behaviour

These are not configurable through environment variables:

- Metrics are exported every 10 seconds. `OTEL_METRIC_EXPORT_INTERVAL` is not
  read.
- Logs are exported record by record, as each one is emitted (a simple log
  record processor, no batching).
- The OpenTelemetry diagnostic logger is set to `ERROR` level when the provider
  is created, so SDK warnings and info messages are not printed. Warnings from
  Connectum itself go through the Node.js process warning channel and are not
  affected.

### Instrumentations

| Variable | Description |
|----------|-------------|
| `OTEL_NODE_DISABLED_INSTRUMENTATIONS` | Read by separately configured Node.js auto-instrumentation packages, not by `@connectum/otel` |

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

Two more promises, both since 1.3.0:

- **A concurrent call waits for the flush.** If `shutdownProvider()` is called while another call is still stopping the provider (two independent shutdown hooks, for example), the second call settles when the first stop has finished and with the same outcome, including the same rejection. Earlier versions returned at once, so a hook that exits the process could run before the last batch was delivered. After the stop has settled, a further call is a no-op.
- **You can bound the wait.** `shutdownProvider({ timeout })` rejects with an error named `TimeoutError` when the stop has not finished within `timeout` milliseconds. The provider is released either way. The exporters are not cancelled: they keep trying in the background until their own timeout ends. There is no default deadline, because one shorter than the exporter timeout would drop telemetry that a slow collector still accepts.

```typescript
server.onShutdown('otel', async () => {
  await shutdownProvider({ timeout: 5_000 });
});
```

### How long shutdown takes with an unavailable collector

Without the `timeout` option, `shutdownProvider()` waits as long as the exporters need. Measured on Node.js 26.12.1 against a local port that refuses connections and against a server that accepts connections and never answers, with one span pending (`tests/integration/shutdown-bound.test.ts`, opt-in):

| Exporter | Collector refuses | Collector accepts and never answers |
|----------|-------------------|-------------------------------------|
| `otlp/http` | 7.4 s, `connect ECONNREFUSED` | 10.0 s, `Timeout` |
| `otlp/http-protobuf` | 8.4 s, `connect ECONNREFUSED` | 10.0 s, `Timeout` |
| `otlp/grpc` | 0.04 s, `14 UNAVAILABLE` | 10.0 s, `Timeout` |

With `OTEL_EXPORTER_OTLP_TIMEOUT=500` the same cases ended after 0.5 s (hang) or immediately (refused). The 10 s is the default `OTEL_EXPORTER_OTLP_TIMEOUT`, the overall timeout of one OTLP export in the OpenTelemetry specification. To make shutdown fit inside the server's `shutdown.timeout` (30 s by default), lower `OTEL_EXPORTER_OTLP_TIMEOUT`, pass `timeout` to `shutdownProvider()`, or both. These are single measurements on one machine, not guarantees.

`initProvider({ settings })` overrides the exporter of a signal in code. Since 1.3.0 it throws `TypeError` before creating anything when `settings` has a key other than `traces`, `metrics` or `logs`, or a value other than `console`, `otlp/http`, `otlp/http-protobuf`, `otlp/grpc` or `none`; the message names the key, the value and the accepted values. Earlier versions fell back to the console exporter without a message, so a typo wrote spans to standard output. The bare `otlp` that the environment variables accept is not a `settings` value; use `otlp/http-protobuf`. An absent or `undefined` entry falls back to the environment.

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
OTEL_RESOURCE_ATTRIBUTES=service.version=1.0.0,service.namespace=production

OTEL_TRACES_EXPORTER=otlp
OTEL_METRICS_EXPORTER=otlp
OTEL_LOGS_EXPORTER=otlp

OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf

OTEL_BSP_SCHEDULE_DELAY=1000
OTEL_BSP_MAX_QUEUE_SIZE=1000
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
OTEL_EXPORTER_OTLP_METRICS_ENDPOINT=http://prometheus:9090/api/v1/otlp/v1/metrics

# Logs -> Loki (via OTLP)
OTEL_EXPORTER_OTLP_LOGS_ENDPOINT=http://loki:3100/otlp/v1/logs
```

Prometheus accepts OTLP metrics only when its OTLP receiver is enabled with
`--web.enable-otlp-receiver`; it does not receive traces or logs. The endpoint
above follows its documented receiver path. Loki's OTLP HTTP endpoint is
`/otlp`; the exporter appends `/v1/logs`. Configure Loki structured metadata
before sending OpenTelemetry logs.

## Related

- [Observability Overview](/en/guide/observability) -- back to overview
- [Tracing](/en/guide/observability/tracing) -- server/client interceptors
- [Metrics](/en/guide/observability/metrics) -- custom metrics
- [Logging](/en/guide/observability/logging) -- structured logging
- [Docker Deployment](/en/guide/production/docker) -- containerized setup
- [@connectum/otel](/en/packages/otel) -- Package Guide
- [@connectum/otel API](/en/api/@connectum/otel/) -- Full API Reference
