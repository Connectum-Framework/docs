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
For streaming RPCs, those aggregate size measurements are recorded as zero;
setting `recordMessages: true` adds per-message `rpc.message` span events with
an estimated serialized size. Message events are disabled by default.

### Attributes and the semantic conventions

The duration histograms use the names and the `s` unit that the OpenTelemetry RPC
semantic conventions define. The attributes on every metric point are:

| Attribute | Value |
|-----------|-------|
| `rpc.system` | `connect_rpc` |
| `rpc.service`, `rpc.method` | Service name and the short method name |
| `server.address`, `server.port` | The server address and port |
| `network.protocol.name`, `network.transport` | `connect_rpc` and `tcp` |
| `transport` | `http` or `in-process`: which transport carried the call. This is a Connectum attribute, not part of the semantic conventions |
| `error.type` | Only for failed calls: the Connect error code name (for example `FAILED_PRECONDITION`), the error class name for another `Error`, otherwise `UNKNOWN` |
| `rpc.connect_rpc.status_code` | Only for failed calls with a Connect error: the numeric Connect code. This is a Connectum attribute, not part of the semantic conventions |

The OpenTelemetry RPC conventions are in the *Release Candidate* status, and newer
revisions use other attribute names than the ones above (`rpc.system.name`,
a fully qualified `rpc.method`, `rpc.response.status_code`), and no longer define the
request and response size metrics or the `rpc.message` event. Connectum keeps its
current names within 1.x so existing dashboards and alerts keep working; dashboards
that filter on these attributes should use the names in the table.

## Related

- [Observability Overview](/en/guide/observability) -- back to overview
- [Tracing](/en/guide/observability/tracing) -- server/client interceptors, deep tracing
- [Backends & Configuration](/en/guide/observability/backends) -- configure metrics exporters
- [@connectum/otel](/en/packages/otel) -- Package Guide
- [@connectum/otel API](/en/api/@connectum/otel/) -- Full API Reference
