---
outline: deep
---

# Health Check Protocol

Connectum implements the [gRPC Health Checking Protocol](https://github.com/grpc/grpc/blob/master/doc/health-checking.md) with additional HTTP endpoints for load balancers and Kubernetes integration.

## Configuration

The `Healthcheck()` factory function accepts the following options:

```typescript
Healthcheck({
  httpEnabled: true,                              // Enable HTTP health endpoints
  httpPaths: ['/healthz', '/health', '/readyz'],  // HTTP endpoint paths
  watchInterval: 500,                             // Watch polling interval (ms)
  manager: customManager,                         // Custom manager instance
})
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `httpEnabled` | `boolean` | `false` | Enable HTTP health endpoints |
| `httpPaths` | `string[]` | `['/healthz', '/health', '/readyz']` | HTTP endpoint paths |
| `watchInterval` | `number` | `500` | Polling interval for Watch streaming (ms) |
| `manager` | `HealthcheckManager` | `healthcheckManager` (singleton) | Custom manager for tests or multi-server setups |

## The healthcheckManager Singleton

The `healthcheckManager` is a global singleton you import from anywhere in your application to update service health status:

```typescript
import { healthcheckManager, ServingStatus } from '@connectum/healthcheck';

// Update overall health status
healthcheckManager.update(ServingStatus.SERVING);

// Update a specific service's health status
healthcheckManager.update(ServingStatus.SERVING, 'my.service.v1.MyService');

// Mark as unhealthy
healthcheckManager.update(ServingStatus.NOT_SERVING);
```

### ServingStatus Values

| Status | Value | Description |
|--------|-------|-------------|
| `UNKNOWN` | `0` | Status is unknown (initial state) |
| `SERVING` | `1` | Service is healthy and accepting requests |
| `NOT_SERVING` | `2` | Service is unhealthy or draining connections |
| `SERVICE_UNKNOWN` | `3` | Requested service is not registered |

### Manager Methods

| Method | Description |
|--------|-------------|
| `update(status, service?)` | Update status. Without `service`, updates all registered services. |
| `getStatus(service)` | Get status of a specific service |
| `getAllStatuses()` | Get a Map of all service statuses |
| `areAllHealthy()` | Check if all services report `SERVING` |
| `initialize(serviceNames)` | Register services for tracking (merge with existing state) |
| `clear()` | Clear all registered services |

## gRPC Health Check Protocol

The package implements three gRPC methods on the `grpc.health.v1.Health` service:

### Health.Check

Returns the current health status:

```bash
# Check overall health
grpcurl -plaintext localhost:5000 grpc.health.v1.Health/Check

# Check a specific service
grpcurl -plaintext \
  -d '{"service": "my.service.v1.MyService"}' \
  localhost:5000 grpc.health.v1.Health/Check
```

### Health.Watch

Streams health status changes in real time:

```bash
grpcurl -plaintext localhost:5000 grpc.health.v1.Health/Watch
```

Behavior follows the gRPC specification:
- Immediately sends the current status
- Sends updates only when the status changes
- For unknown services, sends `SERVICE_UNKNOWN` (does not terminate the call)
- Terminates when the client disconnects

### Health.List

Lists all registered services with their statuses:

```bash
grpcurl -plaintext localhost:5000 grpc.health.v1.Health/List
```

## HTTP Health Endpoints

When `httpEnabled: true`, the following HTTP endpoints are available:

### Default Endpoints

| Path | Description |
|------|-------------|
| `/healthz` | Overall health status |
| `/health` | Overall health status (alias) |
| `/readyz` | Readiness status |

### Response Format

```json
{
  "status": "SERVING",
  "service": "overall",
  "timestamp": "2026-02-12T10:30:00.000Z"
}
```

### HTTP Status Codes

| ServingStatus | HTTP Code |
|---------------|-----------|
| `SERVING` | `200 OK` |
| `NOT_SERVING` | `503 Service Unavailable` |
| `UNKNOWN` | `503 Service Unavailable` |
| `SERVICE_UNKNOWN` | `404 Not Found` |

### Check a Specific Service via HTTP

```bash
curl http://localhost:5000/healthz?service=my.service.v1.MyService
```

### Custom Paths

```typescript
Healthcheck({
  httpEnabled: true,
  httpPaths: ['/healthz', '/ready', '/live'],
})
```

## Custom Dependency Health Checks

Monitor downstream dependencies (databases, external APIs) alongside your service health:

```typescript
import { healthcheckManager, ServingStatus } from '@connectum/healthcheck';

// Initialize tracking for your dependencies
healthcheckManager.initialize([
  'my.service.v1.MyService',
  'dependency.database',
  'dependency.cache',
]);

// Periodically check database health
setInterval(async () => {
  try {
    await db.ping();
    healthcheckManager.update(ServingStatus.SERVING, 'dependency.database');
  } catch {
    healthcheckManager.update(ServingStatus.NOT_SERVING, 'dependency.database');
  }
}, 10000);

// Check cache health
setInterval(async () => {
  try {
    await redis.ping();
    healthcheckManager.update(ServingStatus.SERVING, 'dependency.cache');
  } catch {
    healthcheckManager.update(ServingStatus.NOT_SERVING, 'dependency.cache');
  }
}, 10000);
```

Use `areAllHealthy()` for aggregate health status:

```bash
curl http://localhost:5000/healthz
# Returns 503 if ANY dependency reports NOT_SERVING
```

## Isolated Manager for Testing

Use `createHealthcheckManager()` to create isolated instances for tests or multi-server setups:

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  Healthcheck,
  createHealthcheckManager,
  ServingStatus,
} from '@connectum/healthcheck';
import { createServer } from '@connectum/core';

describe('health check', () => {
  it('should track service status', () => {
    const manager = createHealthcheckManager();
    manager.initialize(['my.service.v1.MyService']);

    manager.update(ServingStatus.SERVING, 'my.service.v1.MyService');
    assert.ok(manager.areAllHealthy());

    manager.update(ServingStatus.NOT_SERVING, 'my.service.v1.MyService');
    assert.ok(!manager.areAllHealthy());
  });

  it('should work with createServer', async () => {
    const manager = createHealthcheckManager();

    const server = createServer({
      services: [routes],
      protocols: [Healthcheck({ httpEnabled: true, manager })],
    });

    server.on('ready', () => {
      manager.update(ServingStatus.SERVING);
    });

    await server.start();
    // ... test assertions ...
    await server.stop();
  });
});
```

## Related

- [Health Checks Overview](/en/guide/health-checks) -- back to overview
- [Kubernetes Integration](/en/guide/health-checks/kubernetes) -- probes, graceful shutdown, shutdown timeline
- [@connectum/healthcheck](/en/packages/healthcheck) -- Package Guide
- [@connectum/healthcheck API](/en/api/@connectum/healthcheck/) -- Full API Reference
