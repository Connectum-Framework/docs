---
title: Observability
description: Route tracing, metrics, logging, and exporter configuration to their canonical Connectum guides.
docType: concept
outline: deep
---

# Observability

`@connectum/otel` connects RPC telemetry and application instrumentation to OpenTelemetry. Instrumentation decides what signals to create; provider/exporter configuration decides where those signals go.

## Minimal RPC instrumentation

```typescript
import { createOtelInterceptor } from '@connectum/otel';

const server = createServer({
  services: [routes],
  interceptors: [
    createOtelInterceptor({
      filter: ({ service }) => !service.includes('grpc.health'),
    }),
  ],
});
```

## Choose the signal

| Need | Canonical guide |
|---|---|
| Server/client RPC spans, propagation, `traced()` or `traceAll()` | [Tracing](/en/guide/observability/tracing) |
| Automatic RPC instruments and application meters | [Metrics](/en/guide/observability/metrics) |
| Structured records and trace correlation | [Logging](/en/guide/observability/logging) |
| OTLP endpoints, exporters, resource metadata, provider lifecycle | [Backends and configuration](/en/guide/observability/backends) |

Focused guides explain task behavior. Exact option fields belong to generated interfaces such as [`OtelInterceptorOptions`](/en/api/@connectum/otel/interfaces/OtelInterceptorOptions) and [`ProviderOptions`](/en/api/@connectum/otel/provider/interfaces/ProviderOptions).

Use the [`@connectum/otel` module hub](/en/packages/otel) for installation, key entry points, source, and API routes. Avoid copying exporter tables into tracing or metrics pages; backend configuration is their canonical owner.
