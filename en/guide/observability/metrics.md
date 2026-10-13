---
title: Record OpenTelemetry Metrics
description: Create application instruments and understand RPC metrics emitted by Connectum.
docType: how-to
outline: deep
---

# Metrics

Collect application and RPC metrics using OpenTelemetry's `Meter` API through the `@connectum/otel` package.

## Using getMeter()

`getMeter()` returns a lazy singleton OpenTelemetry meter:

```typescript
import { getMeter } from '@connectum/otel';

const meter = getMeter();
```

### Counter

Track cumulative values that only increase:

```typescript
const requestCounter = meter.createCounter('http.requests.total', {
  description: 'Total number of requests',
  unit: '1',
});
requestCounter.add(1, { method: 'GET', status: 200 });
```

### Histogram

Record distributions of values (e.g., latencies):

```typescript
const latencyHistogram = meter.createHistogram('request.duration', {
  description: 'Request duration in milliseconds',
  unit: 'ms',
});
latencyHistogram.record(125.5, { method: 'GET' });
```

### UpDownCounter

Track values that can increase and decrease (e.g., active connections):

```typescript
const activeConnections = meter.createUpDownCounter('connections.active');
activeConnections.add(1);   // Connection opened
activeConnections.add(-1);  // Connection closed
```

### ObservableGauge

Report values on demand (pulled during export):

```typescript
meter.createObservableGauge('memory.heap_used', {
  description: 'Heap memory usage',
  unit: 'bytes',
}).addCallback((result) => {
  result.observe(process.memoryUsage().heapUsed);
});
```

## RPC Metrics (Automatic)

The OTel interceptors automatically record standard RPC metrics.

**Server metrics** (via `createOtelInterceptor`):
- `rpc.server.call.duration` -- request duration histogram in seconds
- `rpc.server.request.size` -- request message size
- `rpc.server.response.size` -- response message size

**Client metrics** (via `createOtelClientInterceptor`):
- `rpc.client.call.duration` -- request duration histogram in seconds
- `rpc.client.request.size` -- request message size
- `rpc.client.response.size` -- response message size

Request and response size histograms contain estimates for unary RPC messages.
For streaming RPCs, those aggregate size measurements are recorded as zero. The
size histograms and the `rpc.message` span events are **Connectum-specific**: the
OpenTelemetry RPC conventions define no replacement for them.

### Duration bucket boundaries

`rpc.server.call.duration` and `rpc.client.call.duration` are created with the
explicit bucket boundaries the OpenTelemetry RPC metrics specification recommends,
in seconds, and the package exports them as `RPC_DURATION_BUCKETS`:

```text
0.005, 0.01, 0.025, 0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1, 2.5, 5, 7.5, 10
```

The SDK default boundaries are a millisecond scale (`0, 5, 10, 25, ... 10000`), which
would put every call of a few milliseconds into the first bucket and make percentiles
meaningless. The size histograms keep the SDK defaults.

Connectum's own provider accepts no views. To use other boundaries, set
`OTEL_METRICS_EXPORTER=none`, register your own `MeterProvider` and give it a view for
the instrument; a view takes precedence over the boundaries above:

```typescript
import { metrics } from '@opentelemetry/api';
import { AggregationType, MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

metrics.setGlobalMeterProvider(new MeterProvider({
  readers: [new PeriodicExportingMetricReader({ exporter: myMetricExporter })],
  views: [{
    instrumentName: 'rpc.server.call.duration',
    aggregation: {
      type: AggregationType.EXPLICIT_BUCKET_HISTOGRAM,
      options: { boundaries: [0.001, 0.01, 0.1, 1] },
    },
  }],
}));
```

### Attributes and the semantic conventions

The duration histograms use the names and the `s` unit that the OpenTelemetry RPC
semantic conventions define, and the attribute names of their Connect RPC profile. An
RPC metric point can carry the attributes below; the table states the condition for
those that appear only on some calls:

| Attribute | Value |
|-----------|-------|
| `rpc.system.name` | `connectrpc` |
| `rpc.method` | The fully qualified method, `<package>.<Service>/<Method>` (for example `acme.greeter.v1.GreeterService/SayHello`); it equals the span name |
| `rpc.response.status_code` | A string: `OK` on a successful unary call, otherwise the Connect error code name (for example `FAILED_PRECONDITION`). A streaming call that started successfully carries none, because its final status is not known when the response head returns |
| `error.type` | Only for failed calls, equal to `rpc.response.status_code` for a Connect error; the error class name for another `Error`, otherwise `UNKNOWN` |
| `server.address`, `server.port` | The server address and port |
| `network.protocol.name`, `network.transport` | `connect_rpc` and `tcp` |
| `transport` | `http` or `in-process`: which transport carried the call. This is a Connectum attribute, not part of the semantic conventions |

The same attribute names are set on the spans. Prometheus turns dots into
underscores: `rpc_system_name`, `rpc_method`, `rpc_response_status_code`.

The OpenTelemetry RPC conventions are in the *Development* and *Release Candidate*
statuses, so a later revision may rename attributes again. The renames made in 1.3 are
listed in [RPC telemetry attribute names](/en/migration/otel-rpc-attributes).

### Message events are opt-in

`rpc.message` span events (direction `SENT` or `RECEIVED`, a sequence number and an
estimated serialized size, never the payload) are **optional and off by default**. They
are recorded only when you set `recordMessages: true` on `createOtelInterceptor()` or
`createOtelClientInterceptor()`:

```typescript
const otel = createOtelInterceptor({ recordMessages: true });
```

## Related

- [Observability Overview](/en/guide/observability) -- back to overview
- [Tracing](/en/guide/observability/tracing) -- server/client interceptors, deep tracing
- [Backends & Configuration](/en/guide/observability/backends) -- configure metrics exporters
- [@connectum/otel](/en/packages/otel) -- Package Guide
- [@connectum/otel API](/en/api/@connectum/otel/) -- Full API Reference
