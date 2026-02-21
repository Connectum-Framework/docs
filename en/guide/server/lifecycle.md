---
outline: deep
---

# Server Lifecycle

Connectum servers follow a deterministic state machine. Understanding the lifecycle helps you hook into the right moment for health checks, telemetry, background workers, and resource cleanup.

## Server States

```
created ──> starting ──> running ──> stopping ──> stopped
```

| State | What happens |
|-------|--------------|
| **created** | `createServer()` returns. No port is bound yet. |
| **starting** | `server.start()` called -- the server binds the port and initializes protocols. |
| **running** | The server is accepting requests. |
| **stopping** | `server.stop()` called (or a signal received with `autoShutdown`). Connections are being drained. |
| **stopped** | All connections closed, shutdown hooks executed, resources released. |

The transitions are one-directional. A stopped server cannot be restarted -- create a new one instead.

## Lifecycle Events

Register listeners with `server.on(event, handler)`:

```typescript
server.on('start', () => {
  console.log('Server is starting...');
});

server.on('ready', () => {
  console.log(`Listening on port ${server.address?.port}`);
  healthcheckManager.update(ServingStatus.SERVING);
});

server.on('stopping', () => {
  console.log('Shutdown initiated');
  healthcheckManager.update(ServingStatus.NOT_SERVING);
});

server.on('stop', () => {
  console.log('Server stopped cleanly');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
```

### Event Reference

| Event | Payload | Typical use |
|-------|---------|-------------|
| `start` | -- | Log startup, initialize external connections |
| `ready` | -- | Update health status to `SERVING`, start background workers |
| `stopping` | -- | Update health status to `NOT_SERVING`, stop accepting new work |
| `stop` | -- | Final log, exit the process if needed |
| `error` | `Error` | Log the error, alert monitoring |

### Event Ordering

Events always fire in a fixed order:

```
start → ready → ... (server is running) ... → stopping → stop
```

`error` may fire at any point. If an error occurs during startup, the sequence is `start → error`. If it occurs during shutdown, it is `stopping → error → stop`.

## The shutdownSignal

Every server exposes an `AbortSignal` via `server.shutdownSignal`. The signal is **aborted** when the server enters the `stopping` state. Use it to propagate cancellation to streaming RPCs, background workers, and long-running operations.

```typescript
server.on('ready', () => {
  startBackgroundWorker(server.shutdownSignal);
});

function startBackgroundWorker(signal: AbortSignal) {
  const interval = setInterval(() => {
    if (signal.aborted) {
      clearInterval(interval);
      return;
    }
    // Periodic work
  }, 5_000);
}
```

### With Fetch or Timers

Node.js built-in APIs accept `AbortSignal` natively:

```typescript
import { setTimeout } from 'node:timers/promises';

// Cancels if the server shuts down before the delay completes
await setTimeout(10_000, undefined, { signal: server.shutdownSignal });
```

```typescript
// Abort an outgoing HTTP request when the server shuts down
const res = await fetch('https://api.example.com/data', {
  signal: server.shutdownSignal,
});
```

## Integrating with Health Checks

The `@connectum/healthcheck` package exposes a `healthcheckManager` singleton. Update it in lifecycle events so that load balancers and Kubernetes know when the service is ready:

```typescript
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

The `stopping` handler ensures that readiness probes fail immediately, giving the load balancer time to remove the pod before connections are drained.

## Complete Example

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
  shutdown: { autoShutdown: true, timeout: 25_000 },
});

server.on('start', () => console.log('Starting...'));
server.on('ready', () => {
  console.log(`Ready on port ${server.address?.port}`);
  healthcheckManager.update(ServingStatus.SERVING);
  startBackgroundWorker(server.shutdownSignal);
});
server.on('stopping', () => {
  healthcheckManager.update(ServingStatus.NOT_SERVING);
});
server.on('stop', () => console.log('Stopped'));
server.on('error', (err) => console.error('Error:', err));

await server.start();
```

## Related

- [Server Overview](/en/guide/server) -- quick start and key concepts
- [Configuration](/en/guide/server/configuration) -- environment variables and TLS
- [Graceful Shutdown](/en/guide/server/graceful-shutdown) -- hooks, timeouts, and Kubernetes
- [@connectum/core](/en/packages/core) -- Package Guide
- [@connectum/core API](/en/api/@connectum/core/) -- Full API Reference
