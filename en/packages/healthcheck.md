---
title: '@connectum/healthcheck'
description: gRPC Health Check protocol and HTTP health endpoints for Connectum
---

# @connectum/healthcheck

Implements the [gRPC Health Checking Protocol](https://github.com/grpc/grpc/blob/master/doc/health-checking.md) as a Connectum protocol plugin. Provides gRPC `Check`, `Watch`, and `List` RPCs, plus optional HTTP endpoints (`/healthz`, `/health`, `/readyz`) for Kubernetes probes and load balancers.

**Layer**: 1 (Protocol)

::: tip Related Guides
- [Health Checks Overview](/en/guide/health-checks) -- gRPC and HTTP health endpoints
- [gRPC & HTTP Protocol](/en/guide/health-checks/protocol) -- detailed protocol configuration
- [Kubernetes Integration](/en/guide/health-checks/kubernetes) -- probes, shutdown, zero-downtime
:::

::: tip Full API Reference
Complete TypeScript API documentation: [API Reference](/en/api/@connectum/healthcheck/)
:::

## Installation

```bash
pnpm add @connectum/healthcheck
```

**Peer dependency**: `@connectum/core`

## Quick Start

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';

const server = createServer({
  services: [routes],
  protocols: [Healthcheck({ httpEnabled: true })],
  shutdown: { autoShutdown: true },
});

server.on('ready', () => {
  healthcheckManager.update(ServingStatus.SERVING);
});

server.on('stopping', () => {
  healthcheckManager.update(ServingStatus.NOT_SERVING);
});

await server.start();
```

## API Reference

### `Healthcheck(options?)`

Factory function that creates a `ProtocolRegistration` for the healthcheck protocol.

```typescript
function Healthcheck(options?: HealthcheckOptions): ProtocolRegistration;
```

Pass the result to `createServer({ protocols: [...] })`.

### `HealthcheckOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `httpEnabled` | `boolean` | `false` | Enable HTTP health endpoints |
| `httpPaths` | `string[]` | `["/healthz", "/health", "/readyz"]` | HTTP endpoint paths |
| `watchInterval` | `number` | `500` | Polling interval (ms) for streaming Watch RPC |
| `manager` | `HealthcheckManager` | `healthcheckManager` (singleton) | Custom manager instance |

### `healthcheckManager` (Singleton)

Module-level singleton for controlling health status. Import it from any file in your application.

```typescript
import { healthcheckManager, ServingStatus } from '@connectum/healthcheck';

// Set all services to SERVING
healthcheckManager.update(ServingStatus.SERVING);

// Set a specific service
healthcheckManager.update(ServingStatus.NOT_SERVING, 'my.service.v1.MyService');

// Check overall health
const allHealthy = healthcheckManager.areAllHealthy();

// Get specific service status
const status = healthcheckManager.getStatus('my.service.v1.MyService');

// Get all statuses
const allStatuses = healthcheckManager.getAllStatuses();
```

### `HealthcheckManager` Class

```typescript
class HealthcheckManager {
  /** Update status for all registered entries (no service arg) or a specific one. Throws on an unknown name. */
  update(status: ServingStatus, service?: string): void;

  /** Register an application health component (default UNKNOWN). Re-registering preserves the current status. */
  register(component: string, initialStatus?: ServingStatus): void;

  /** Set a component's status (upsert: registers the component if absent). */
  set(component: string, status: ServingStatus): void;

  /** Remove a registered component. */
  unregister(component: string): void;

  /** Get status of a specific service or component */
  getStatus(service: string): ServiceStatus | undefined;

  /** Get all service and component statuses */
  getAllStatuses(): Map<string, ServiceStatus>;

  /** Check if all services and components are SERVING */
  areAllHealthy(): boolean;

  /** Initialize the RPC service slice (called automatically by the protocol). Replaces only `service` entries; never touches components. */
  initialize(serviceNames: string[]): void;

  /** Clear all services and components */
  clear(): void;
}
```

#### Services vs components

The registry tracks two kinds of entries. **Services** are Connect RPC services
owned by the Healthcheck protocol — `initialize()` adds, preserves, and removes
them on server start. **Components** are application-defined readiness gates
(`process`, `amqp`, a database connection, …) owned by the application via
`register()` / `set()` / `unregister()` — `initialize()` never touches them.
Component names must be non-empty and dot-free (dotted names are reserved for
RPC service typeNames). A registered component participates in `areAllHealthy()`,
gRPC `Check`/`Watch`, and `/healthz` exactly like a service.

> **Workers without RPC:** a worker with `services: []` can never become SERVING
> through the service registry (it stays empty, `/healthz` answers 503). Register
> a `process` component instead and drive it from `ready`/`stopping` events.

> **Note on blanket `update(status)`:** without a service name it overwrites
> **every** registered entry, components included. In a mixed app, update an
> independently managed component addressably via `set(component, status)` so a
> blanket `update(SERVING)` on `ready` cannot mask a real component failure.

### `createHealthcheckManager()`

Creates an isolated `HealthcheckManager` instance. Useful for testing or running multiple servers in one process.

```typescript
import { Healthcheck, createHealthcheckManager, ServingStatus } from '@connectum/healthcheck';

const manager = createHealthcheckManager();
const server = createServer({
  protocols: [Healthcheck({ manager })],
});
manager.update(ServingStatus.SERVING);
```

### `ServingStatus`

Re-exported from generated gRPC health proto. Values:

| Constant | Value | Description |
|----------|-------|-------------|
| `ServingStatus.UNKNOWN` | `0` | Status unknown (initial state) |
| `ServingStatus.SERVING` | `1` | Service is healthy |
| `ServingStatus.NOT_SERVING` | `2` | Service is unhealthy |
| `ServingStatus.SERVICE_UNKNOWN` | `3` | Service not recognized |

## gRPC Health Check Protocol

The protocol registers the standard `grpc.health.v1.Health` service:

| RPC | Type | Description |
|-----|------|-------------|
| `Check` | Unary | Returns serving status for a service. Empty service name checks overall health. Returns `NOT_FOUND` for unknown services. |
| `Watch` | Server-streaming | Sends initial status immediately, then sends updates only when status changes. |
| `List` | Unary | Returns all registered services with their statuses. |

### Testing with grpcurl

```bash
# Check overall health
grpcurl -plaintext localhost:5000 grpc.health.v1.Health/Check

# Check specific service
grpcurl -plaintext -d '{"service": "my.service.v1.MyService"}' \
  localhost:5000 grpc.health.v1.Health/Check

# List all services
grpcurl -plaintext localhost:5000 grpc.health.v1.Health/List
```

## HTTP Health Endpoints

When `httpEnabled: true`, HTTP endpoints respond with JSON:

```
GET /healthz                          -> overall health
GET /healthz?service=my.v1.MyService  -> specific service
GET /health                           -> same as /healthz
GET /readyz                           -> same as /healthz
```

### Response Format

```json
{
  "status": "SERVING",
  "service": "overall",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### HTTP Status Code Mapping

| ServingStatus | HTTP Status |
|---------------|-------------|
| `SERVING` | 200 |
| `NOT_SERVING` | 503 |
| `SERVICE_UNKNOWN` | 404 |
| `UNKNOWN` | 503 |

## Exports Summary

| Export | Description |
|--------|-------------|
| `Healthcheck` | Protocol registration factory |
| `healthcheckManager` | Default singleton manager |
| `HealthcheckManager` | Manager class |
| `createHealthcheckManager` | Factory for isolated manager instances |
| `createHttpHealthHandler` | HTTP handler factory (advanced) |
| `parseServiceFromUrl` | URL query parser utility |
| `ServingStatus` | Serving status constants |
| `ServiceStatus` | Service status type |
| `HealthcheckOptions` | Options type |

## Related Packages

- **[@connectum/core](./core.md)** -- Server that hosts this protocol (peer dependency)
- **[@connectum/reflection](./reflection.md)** -- Companion protocol for service discovery
