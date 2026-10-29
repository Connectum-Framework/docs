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

The request and response size histograms of a unary RPC hold the size of the
message in bytes: the length of its Protobuf wire encoding
(`toBinary(schema, message).byteLength` with the schema of the method's input or
output), before any compression. For streaming RPCs, those aggregate size
measurements are recorded as zero; the size of each message of a stream is
available in the `rpc.message` span events (see
[Message events are opt-in](#message-events-are-opt-in)). A message that cannot be
serialized counts as zero bytes and never fails the call. Sizes are computed only
when the size histograms or `recordMessages` are on. The size histograms and the
`rpc.message` span events are **Connectum-specific**: the OpenTelemetry RPC
conventions define no replacement for them.

### Duration of streaming RPCs

A call lasts until its response ends. For a server-streaming, client-streaming or
bidirectional call, `rpc.server.call.duration` and `rpc.client.call.duration` are
recorded once, when the response stream ends: after the last message, when the
stream fails, or when the consumer stops reading it. The value equals the duration
of the span of the same call, as the OpenTelemetry RPC metrics conventions ask. A
response stream that nobody iterates never ends, so it records neither a duration
nor ends its span.

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
| `rpc.response.status_code` | A string: `OK` on a successful unary call, otherwise the Connect error code name (for example `FAILED_PRECONDITION`). A canceled call reports `CANCELED` (one L, as Connect spells it; `CANCELLED` is the gRPC spelling and is never produced), so a query over data from both stacks can match `CANCEL+ED`. A streaming call that ends normally, or whose consumer stops reading it, carries none; a stream that fails after it started carries the code of the failure |
| `error.type` | Only for failed calls, equal to `rpc.response.status_code` for a Connect error; the error class name for another `Error` (the error's `name` for an anonymous class, `_OTHER` if that is empty too), otherwise `UNKNOWN`. A stream that fails after it started carries it as a unary call does. The server records it for every non-OK code, including the codes that do not mark the server span as an error (see [Span status](/en/guide/observability/tracing#span-status)) |
| `server.address`, `server.port` | The server address and port |
| `network.protocol.name`, `network.transport` | `connect_rpc` and `tcp` |
| `transport` | `http` or `in-process`: which transport carried the call. This is a Connectum attribute, not part of the semantic conventions |

The spans carry the same attribute names, except that the transport attribute is named
`connectum.transport` on spans and `transport` on metrics. Prometheus turns dots into
underscores: `rpc_system_name`, `rpc_method`, `rpc_response_status_code`.

The OpenTelemetry RPC conventions are in the *Development* and *Release Candidate*
statuses, so a later revision may rename attributes again. The renames made in 1.3 are
listed in [RPC telemetry attribute names](/en/migration/otel-rpc-attributes).

### Message events are opt-in

`rpc.message` span events (direction `SENT` or `RECEIVED`, a sequence number and the
serialized size in bytes as `rpc.message.uncompressed_size`, never the payload) are **optional and off by default**. They
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
