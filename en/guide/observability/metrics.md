---
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
- `rpc.server.duration` -- request duration histogram
- `rpc.server.request.size` -- request message size
- `rpc.server.response.size` -- response message size

**Client metrics** (via `createOtelClientInterceptor`):
- `rpc.client.duration` -- request duration histogram
- `rpc.client.request.size` -- request message size
- `rpc.client.response.size` -- response message size

## Related

- [Observability Overview](/en/guide/observability) -- back to overview
- [Tracing](/en/guide/observability/tracing) -- server/client interceptors, deep tracing
- [Backends & Configuration](/en/guide/observability/backends) -- configure metrics exporters
- [@connectum/otel](/en/packages/otel) -- Package Guide
- [@connectum/otel API](/en/api/@connectum/otel/) -- Full API Reference
