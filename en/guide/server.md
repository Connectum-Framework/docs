---
outline: deep
---

# Server

`createServer()` is the single entry point for every Connectum service -- it wires up transports, interceptors, protocols, and graceful shutdown in one call.

## Quick Start

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';
import { createDefaultInterceptors } from '@connectum/interceptors';
import routes from '#gen/routes.js';

const server = createServer({
  services: [routes],
  port: 5000,
  protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
  interceptors: createDefaultInterceptors(),
  shutdown: { autoShutdown: true, timeout: 30_000 },
});

server.on('ready', () => healthcheckManager.update(ServingStatus.SERVING));
server.on('stop', () => console.log('Server stopped'));

await server.start();
```

## Key Concepts

### Server States

Every server follows a deterministic state machine:

| State | Description |
|-------|-------------|
| `created` | Server object constructed, not yet listening |
| `starting` | Binding port, initializing protocols |
| `running` | Accepting requests |
| `stopping` | Draining connections, executing shutdown hooks |
| `stopped` | Fully shut down, all resources released |

### Lifecycle Events

| Event | Fires when |
|-------|------------|
| `start` | Server begins the start sequence |
| `ready` | Server is bound and accepting requests |
| `stopping` | Shutdown initiated (signal or manual `stop()`) |
| `stop` | Server is fully stopped |
| `error` | An error occurs during start or shutdown |

### shutdownSignal

The server exposes an `AbortSignal` via `server.shutdownSignal`. It is aborted when shutdown begins -- pass it to streaming handlers and background workers so they can cancel gracefully.

```typescript
server.on('ready', () => {
  startBackgroundWorker(server.shutdownSignal);
});
```

## Learn More

- [Lifecycle](/en/guide/server/lifecycle) -- states, events, and the shutdownSignal in detail
- [Configuration](/en/guide/server/configuration) -- environment variables, TLS, and schema extension
- [Graceful Shutdown](/en/guide/server/graceful-shutdown) -- hooks, timeouts, and Kubernetes integration
- [@connectum/core](/en/packages/core) -- Package Guide
- [@connectum/core API](/en/api/@connectum/core/) -- Full API Reference
