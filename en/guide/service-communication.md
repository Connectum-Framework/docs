---
outline: deep
---

# Service Communication

Use `createClient()` + `createGrpcTransport()` from ConnectRPC to call other services.
Add `createOtelClientInterceptor()` for distributed tracing and `createDefaultInterceptors()`
with client-safe options for resilience.

## Quick Start

```typescript
import { createClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { createOtelClientInterceptor } from '@connectum/otel';
import { createDefaultInterceptors } from '@connectum/interceptors';
import { InventoryService } from '#gen/inventory/v1/inventory_pb.js';

// 1. Create transport with OTel + resilience interceptors
const inventoryTransport = createGrpcTransport({
  baseUrl: `http://${process.env.INVENTORY_HOST}:${process.env.INVENTORY_PORT}`,
  httpVersion: '2',
  interceptors: [
    createOtelClientInterceptor({
      serverAddress: process.env.INVENTORY_HOST!,
      serverPort: Number(process.env.INVENTORY_PORT),
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

// 2. Create typed client
const inventoryClient = createClient(InventoryService, inventoryTransport);

// 3. Call from any handler
const stock = await inventoryClient.checkStock({ sku: 'ABC-123' });
```

Trace context propagates automatically -- the client span links to the server span in the downstream service.

## Key Concepts

### Transport Configuration

`createGrpcTransport()` creates an HTTP/2 transport for gRPC communication:

| Option | Type | Description |
|--------|------|-------------|
| `baseUrl` | `string` | Target service URL (e.g. `http://order-service:5000`) |
| `httpVersion` | `'2'` | HTTP version (always `'2'` for gRPC) |
| `interceptors` | `Interceptor[]` | Client-side interceptor chain |

For ConnectRPC protocol (HTTP/1.1 JSON), use `createConnectTransport()` instead.

### Client vs Server Interceptors

Not all server interceptors are appropriate for client transports. When using `createDefaultInterceptors()` on the client side, disable server-only interceptors:

| Interceptor | Server | Client | Notes |
|-------------|:------:|:------:|-------|
| **errorHandler** | Yes | No | Normalizes errors for responses -- not needed on client |
| **timeout** | Yes | Yes | Enforce per-request deadline |
| **bulkhead** | Yes | No | Limits server concurrency -- not applicable to clients |
| **circuitBreaker** | Yes | Yes | Prevents cascading failures to downstream services |
| **retry** | Yes | Yes | Retries transient errors |
| **fallback** | Yes | No | Requires server-side handler |
| **validation** | Yes | No | Validates incoming requests -- not outgoing |
| **serializer** | Yes | No | Server-side JSON serialization |

### Service Discovery

| Pattern | When to Use | Example |
|---------|-------------|---------|
| **Kubernetes DNS** | Most K8s deployments | `http://order-service.production.svc.cluster.local:5000` |
| **Environment variables** | Simple setups, Docker Compose | `http://${process.env.ORDER_HOST}:${process.env.ORDER_PORT}` |
| **Buf Schema Registry** | Polyrepo proto management | Centralized proto definitions via [BSR](https://buf.build/product/bsr) |
| **gRPC Server Reflection** | Development, tooling | Runtime API discovery via `grpcurl`, `grpcui` |

In Kubernetes, services are discoverable via DNS. A Connectum service deployed as `order-service` in namespace `production` is reachable at `order-service.production.svc.cluster.local:5000`. No external service registry is needed.

## Learn More

- [Communication Patterns](./service-communication/patterns) -- request-response, fan-out, streaming
- [Client Interceptors](./service-communication/client-interceptors) -- OTel, resilience, custom
- [Distributed Tracing](/en/guide/observability/tracing) -- trace context propagation
- [Architecture Patterns](/en/guide/production/architecture) -- full production architecture reference
- [@connectum/otel](/en/packages/otel) -- Package Guide
- [@connectum/otel API](/en/api/@connectum/otel/) -- Full API Reference
