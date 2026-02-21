---
outline: deep
---

# Observability

First-class OpenTelemetry support via `@connectum/otel` -- distributed tracing, metrics, and structured logging for your Connectum services.

## Quick Start

```typescript
import { createServer } from '@connectum/core';
import { createOtelInterceptor } from '@connectum/otel';
import routes from '#gen/routes.js';

const server = createServer({
  services: [routes],
  port: 5000,
  interceptors: [
    createOtelInterceptor({
      filter: ({ service }) => !service.includes('grpc.health'),
    }),
  ],
});

await server.start();
```

```bash
# .env
OTEL_SERVICE_NAME=my-service
OTEL_TRACES_EXPORTER=otlp
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

## Installation

```bash
pnpm add @connectum/otel
```

Peer dependencies (installed automatically): `@opentelemetry/api`, `@opentelemetry/sdk-node`.

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Server Interceptor** | `createOtelInterceptor()` -- traces all incoming RPC calls |
| **Client Interceptor** | `createOtelClientInterceptor()` -- propagates trace context to outgoing calls |
| **Deep Tracing** | `traced()` and `traceAll()` -- instrument business logic functions |
| **Metrics** | `getMeter()` -- counters, histograms, gauges via OpenTelemetry |
| **Logging** | `getLogger()` -- structured logging with trace correlation |
| **Backends** | Configure via environment variables -- Jaeger, Grafana, any OTLP collector |

## Learn More

- [Tracing](/en/guide/observability/tracing) -- server/client interceptors, deep tracing, distributed traces
- [Metrics](/en/guide/observability/metrics) -- counters, histograms, automatic RPC metrics
- [Logging](/en/guide/observability/logging) -- structured logging with trace correlation
- [Backends & Configuration](/en/guide/observability/backends) -- environment variables, provider management, Jaeger/Grafana setup
- [@connectum/otel](/en/packages/otel) -- Package Guide
- [@connectum/otel API](/en/api/@connectum/otel/) -- Full API Reference
