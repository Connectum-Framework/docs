---
outline: deep
---

# Client Interceptors

Interceptors for outgoing gRPC client calls -- observability, resilience, and custom logic.

## OTel Client Interceptor

`createOtelClientInterceptor()` instruments outgoing RPC calls with OpenTelemetry tracing and metrics:

```typescript
import { createGrpcTransport } from '@connectrpc/connect-node';
import { createOtelClientInterceptor } from '@connectum/otel';

const transport = createGrpcTransport({
  baseUrl: 'http://user-service:5001',
  httpVersion: '2',
  interceptors: [
    createOtelClientInterceptor({
      serverAddress: 'user-service',   // Required
      serverPort: 5001,
    }),
  ],
});
```

The interceptor:
- Injects trace context into outgoing requests via `propagation.inject()` -- downstream services receive the parent span
- Creates `SpanKind.CLIENT` spans with [OTel semantic conventions](https://opentelemetry.io/docs/specs/semconv/rpc/connect-rpc/)
- Records `rpc.client.*` metrics (duration, request/response size)

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `serverAddress` | `string` | **(required)** | Target server address (`server.address` attribute) |
| `serverPort` | `number` | -- | Target server port (`server.port` attribute) |
| `withoutTracing` | `boolean` | `false` | Disable span creation (metrics only) |
| `withoutMetrics` | `boolean` | `false` | Disable metric recording (tracing only) |
| `filter` | `OtelFilter` | -- | Skip specific RPCs from instrumentation |
| `attributeFilter` | `OtelAttributeFilter` | -- | Exclude specific span attributes |
| `recordMessages` | `boolean` | `false` | Include message content in span events (may contain sensitive data) |

### Trace Context Propagation

When both server and client interceptors are configured, trace context flows automatically across service boundaries:

```
Service A (server span) → Service A (client span) → Service B (server span)
```

```typescript
// Service A: server OTel interceptor + client OTel interceptor
const server = createServer({
  services: [routes],
  interceptors: [
    createOtelInterceptor({ serverPort: 5000 }),  // Server spans
  ],
});

const userTransport = createGrpcTransport({
  baseUrl: 'http://user-service:5001',
  httpVersion: '2',
  interceptors: [
    createOtelClientInterceptor({                  // Client spans
      serverAddress: 'user-service',
      serverPort: 5001,
    }),
  ],
});
```

In a trace viewer (Jaeger, Grafana Tempo), you'll see a single trace spanning both services with linked spans.

## Resilience for Clients

Use `createDefaultInterceptors()` on client transports for circuit breaker, timeout, and retry. Disable server-only interceptors:

```typescript
import { createDefaultInterceptors } from '@connectum/interceptors';

const transport = createGrpcTransport({
  baseUrl: 'http://inventory-service:5000',
  httpVersion: '2',
  interceptors: [
    createOtelClientInterceptor({
      serverAddress: 'inventory-service',
      serverPort: 5000,
    }),
    ...createDefaultInterceptors({
      circuitBreaker: { failureThreshold: 5 },
      timeout: { duration: 5_000 },
      retry: { maxRetries: 2 },
      // Disable server-only interceptors
      bulkhead: false,
      errorHandler: false,
      serializer: false,
      validation: false,
    }),
  ],
});
```

### Circuit Breaker Behavior

The circuit breaker tracks consecutive failures per client transport:

| State | Behavior |
|-------|----------|
| **Closed** | Requests pass through normally |
| **Open** | Requests fail immediately with `Unavailable` (no downstream call) |
| **Half-Open** | A single probe request is allowed; success closes, failure re-opens |

The default `failureThreshold` is 5 consecutive failures. After the circuit opens, it automatically transitions to half-open after a cooldown period.

### Per-Service Configuration

Create separate transports with different resilience settings for each downstream service:

```typescript
// Critical service: aggressive retry, short timeout
const paymentTransport = createGrpcTransport({
  baseUrl: 'http://payment-service:5000',
  httpVersion: '2',
  interceptors: [
    createOtelClientInterceptor({ serverAddress: 'payment-service', serverPort: 5000 }),
    ...createDefaultInterceptors({
      timeout: { duration: 3_000 },
      retry: { maxRetries: 3 },
      circuitBreaker: { failureThreshold: 3 },
      bulkhead: false, errorHandler: false, serializer: false, validation: false,
    }),
  ],
});

// Non-critical service: lenient timeout, fewer retries
const recommendationTransport = createGrpcTransport({
  baseUrl: 'http://recommendation-service:5000',
  httpVersion: '2',
  interceptors: [
    createOtelClientInterceptor({ serverAddress: 'recommendation-service', serverPort: 5000 }),
    ...createDefaultInterceptors({
      timeout: { duration: 10_000 },
      retry: { maxRetries: 1 },
      circuitBreaker: { failureThreshold: 10 },
      bulkhead: false, errorHandler: false, serializer: false, validation: false,
    }),
  ],
});
```

## Client Metrics

`createRpcClientMetrics()` provides standalone client metrics following OTel semantic conventions:

```typescript
import { createRpcClientMetrics, getMeter } from '@connectum/otel';

const meter = getMeter();
const clientMetrics = createRpcClientMetrics(meter);
```

| Metric | Name | Unit | Description |
|--------|------|------|-------------|
| `callDuration` | `rpc.client.call.duration` | seconds | Histogram of call durations |
| `requestSize` | `rpc.client.request.size` | bytes | Histogram of request sizes |
| `responseSize` | `rpc.client.response.size` | bytes | Histogram of response sizes |

These metrics are recorded automatically when using `createOtelClientInterceptor()` (unless `withoutMetrics: true`).

## Streaming Instrumentation

Both server and client interceptors automatically instrument streaming RPCs (client streaming, server streaming, and bidirectional).

**Span lifecycle** for streaming calls:

1. Span starts when the RPC begins
2. Individual `rpc.message` events are recorded for each sent/received message (when `recordMessages` is enabled)
3. Span ends when the stream is fully consumed, errors, or is broken

This ensures accurate duration measurement for long-lived streams.

### Streaming Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `rpc.message.id` | sequential number | Message sequence number within the stream |
| `rpc.message.type` | `"SENT"` / `"RECEIVED"` | Message direction |
| `rpc.message.uncompressed_size` | bytes (estimated) | Estimated message size |
| `network.transport` | `"tcp"` | Network transport protocol |

## Related

- [Service Communication](/en/guide/service-communication) -- overview, transport configuration, service discovery
- [Communication Patterns](./patterns) -- request-response, fan-out, streaming
- [Distributed Tracing](/en/guide/observability/tracing) -- server/client interceptors, deep tracing
- [Interceptors](/en/guide/interceptors) -- server-side interceptor chain
- [@connectum/otel](/en/packages/otel) -- Package Guide
- [@connectum/otel API](/en/api/@connectum/otel/) -- Full API Reference
