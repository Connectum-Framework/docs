---
outline: deep
---

# Health Checks

gRPC Health Checking Protocol implementation with HTTP endpoints for Kubernetes liveness and readiness probes.

## Quick Start

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import routes from '#gen/routes.js';

const server = createServer({
  services: [routes],
  port: 5000,
  protocols: [Healthcheck({ httpEnabled: true })],
});

server.on('ready', () => {
  healthcheckManager.update(ServingStatus.SERVING);
});

await server.start();
```

## Installation

```bash
pnpm add @connectum/healthcheck
```

## Key Concepts

| Concept | Description |
|---------|-------------|
| **ServingStatus** | `UNKNOWN` (0), `SERVING` (1), `NOT_SERVING` (2), `SERVICE_UNKNOWN` (3) |
| **gRPC Protocol** | `Health/Check`, `Health/Watch`, `Health/List` on `grpc.health.v1.Health` |
| **HTTP Endpoints** | `/healthz`, `/health`, `/readyz` -- returns JSON with status and HTTP 200/503/404 |
| **healthcheckManager** | Global singleton to update service status from anywhere in your app |
| **Health Components** | Application-defined readiness gates (`register`/`set`/`unregister`) for workers without RPCs |
| **Dependency Checks** | Track downstream services (database, cache) alongside your service health |

## Workers Without RPC

A worker service with no public RPCs (`services: []`) — a poller, publisher,
or exporter — has an empty service registry, so `/healthz` answers 503
permanently and `depends_on: condition: service_healthy` gating never passes.
Register a process **component** instead. Components are owned by the
application, survive server start, and participate in `Check`/`Watch`/`healthz`
exactly like services:

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';

const server = createServer({
  services: [],            // no public RPCs
  protocols: [Healthcheck({ httpEnabled: true })],
});

healthcheckManager.register('process');  // before or after start — both work

server.on('ready', () => healthcheckManager.set('process', ServingStatus.SERVING));
server.on('stopping', () => healthcheckManager.set('process', ServingStatus.NOT_SERVING));

await server.start();
```

Component names must be dot-free (`process`, `amqp`, `db`) — dotted names are
reserved for RPC service typeNames, so the namespaces cannot collide.

## Learn More

- [Protocol Details](/en/guide/health-checks/protocol) -- gRPC methods, HTTP endpoints, configuration options, dependency checks
- [Kubernetes Integration](/en/guide/health-checks/kubernetes) -- HTTP/gRPC probes, graceful shutdown integration, shutdown timeline
- [@connectum/healthcheck](/en/packages/healthcheck) -- Package Guide
- [@connectum/healthcheck API](/en/api/@connectum/healthcheck/) -- Full API Reference
