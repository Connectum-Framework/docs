---
title: Graceful Shutdown
description: Configure graceful shutdown with connection draining, shutdown hooks, and Kubernetes integration in Connectum.
outline: deep
---

# Graceful Shutdown

Connectum provides built-in graceful shutdown support that handles signal interception, connection draining, shutdown hooks with dependency ordering, and integration with Kubernetes lifecycle.

## Quick Setup

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';

const server = createServer({
  services: [routes],
  protocols: [Healthcheck({ httpEnabled: true })],
  shutdown: {
    autoShutdown: true,    // Handle SIGTERM/SIGINT automatically
    timeout: 30000,        // 30 seconds to drain connections
  },
});

server.on('ready', () => {
  healthcheckManager.update(ServingStatus.SERVING);
});

server.on('stopping', () => {
  healthcheckManager.update(ServingStatus.NOT_SERVING);
});

await server.start();
```

## Shutdown Options

The `shutdown` option in `createServer()` accepts a `ShutdownOptions` object:

```typescript
interface ShutdownOptions {
  /** Timeout in ms for graceful shutdown (default: 30000) */
  timeout?: number;

  /** Signals to listen for (default: ['SIGTERM', 'SIGINT']) */
  signals?: NodeJS.Signals[];

  /** Auto-handle signals (default: false) */
  autoShutdown?: boolean;

  /** Force close HTTP/2 sessions on timeout (default: true) */
  forceCloseOnTimeout?: boolean;
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `timeout` | `30000` | Maximum time (ms) to wait for in-flight requests |
| `signals` | `['SIGTERM', 'SIGINT']` | OS signals that trigger shutdown |
| `autoShutdown` | `false` | Automatically install signal handlers |
| `forceCloseOnTimeout` | `true` | Destroy HTTP/2 sessions if timeout exceeded |

## Shutdown Sequence

When `server.stop()` is called (or a signal is received with `autoShutdown: true`), the following sequence executes:

```
1. STOPPING event     -- Notify listeners (update health check to NOT_SERVING)
2. Abort signal       -- Signal streaming RPCs and long-running operations
3. Transport close    -- Send GOAWAY, stop accepting new connections
4. Timeout race       -- Wait for in-flight requests OR timeout
5. Force close        -- If timeout + forceCloseOnTimeout: destroy all HTTP/2 sessions
6. Shutdown hooks     -- Execute registered hooks in dependency order
7. Dispose            -- Clean up internal state
8. STOP event         -- Server is fully stopped
```

### Lifecycle Events During Shutdown

```typescript
server.on('stopping', () => {
  // Phase 1: Server begins shutdown
  // Update health status so load balancers stop sending traffic
  healthcheckManager.update(ServingStatus.NOT_SERVING);
  console.log('Shutdown initiated...');
});

server.on('stop', () => {
  // Phase 8: Server is fully stopped
  console.log('Server stopped cleanly');
});

server.on('error', (err) => {
  // Emitted if shutdown encounters an error
  console.error('Shutdown error:', err);
});
```

### The shutdownSignal

The server provides an `AbortSignal` that is aborted when shutdown begins. Use it to cancel streaming RPCs and long-running operations:

```typescript
server.on('ready', () => {
  // Pass to streaming handlers
  startBackgroundWorker(server.shutdownSignal);
});

function startBackgroundWorker(signal: AbortSignal) {
  const interval = setInterval(() => {
    if (signal.aborted) {
      clearInterval(interval);
      return;
    }
    // Do periodic work
  }, 5000);
}
```

## Shutdown Hooks

Shutdown hooks allow you to run cleanup logic during shutdown with dependency ordering. Register them via `server.onShutdown()`.

### Anonymous Hooks

```typescript
server.onShutdown(async () => {
  await db.close();
});

server.onShutdown(() => {
  console.log('Cleanup complete');
});
```

### Named Hooks

Give hooks names for better logging and dependency management:

```typescript
server.onShutdown('database', async () => {
  await db.close();
  console.log('Database connections closed');
});

server.onShutdown('cache', async () => {
  await redis.quit();
  console.log('Cache connections closed');
});
```

### Hooks with Dependency Ordering

Specify dependencies to control execution order. Dependencies execute **first**:

```typescript
// Database must shut down before the server's HTTP layer
server.onShutdown('database', async () => {
  await db.close();
});

// Cache depends on database (database shuts down first)
server.onShutdown('cache', ['database'], async () => {
  await redis.quit();
});

// Message queue depends on both database and cache
server.onShutdown('message-queue', ['database', 'cache'], async () => {
  await mq.disconnect();
});
```

Execution order:

```
1. database      (no dependencies, runs first)
2. cache         (depends on database)
3. message-queue (depends on database + cache)
```

::: warning Cycle detection
The shutdown manager detects dependency cycles at registration time and throws an error:

```typescript
server.onShutdown('a', ['b'], () => {});
server.onShutdown('b', ['a'], () => {}); // Throws: dependency cycle detected
```
:::

### Multiple Handlers per Module

You can register multiple handlers for the same named module. They run in parallel:

```typescript
server.onShutdown('database', async () => {
  await primaryDb.close();
});

server.onShutdown('database', async () => {
  await replicaDb.close();
});
// Both database handlers run in parallel during shutdown
```

## Automatic vs Manual Shutdown

### Automatic Shutdown

With `autoShutdown: true`, the server installs signal handlers automatically:

```typescript
const server = createServer({
  services: [routes],
  shutdown: {
    autoShutdown: true,
    signals: ['SIGTERM', 'SIGINT'],  // default
    timeout: 30000,
  },
});

await server.start();
// Server stops cleanly on SIGTERM or SIGINT (Ctrl+C)
```

### Manual Shutdown

Without `autoShutdown`, call `server.stop()` yourself:

```typescript
const server = createServer({
  services: [routes],
  // autoShutdown defaults to false
});

await server.start();

// Manual shutdown handler
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM');
  healthcheckManager.update(ServingStatus.NOT_SERVING);

  // Optional: wait for load balancers to drain
  await new Promise(resolve => setTimeout(resolve, 5000));

  await server.stop();
  process.exit(0);
});
```

::: tip When to use manual shutdown
Manual shutdown is useful when you need to perform actions **before** calling `server.stop()`, such as waiting for load balancer drain or notifying external services.
:::

### Idempotent stop()

`server.stop()` is safe to call multiple times. Concurrent calls return the same Promise:

```typescript
// Both resolve when the single shutdown completes
await Promise.all([
  server.stop(),
  server.stop(),
]);
```

## Kubernetes Integration

### Recommended Configuration

For Kubernetes deployments, combine graceful shutdown with health checks and a pre-stop hook:

```typescript
const server = createServer({
  services: [routes],
  protocols: [Healthcheck({ httpEnabled: true })],
  shutdown: {
    autoShutdown: true,
    timeout: 25000,  // Less than Kubernetes terminationGracePeriodSeconds
  },
});

server.on('ready', () => {
  healthcheckManager.update(ServingStatus.SERVING);
});

server.on('stopping', () => {
  healthcheckManager.update(ServingStatus.NOT_SERVING);
});
```

### Pod Specification

```yaml
apiVersion: v1
kind: Pod
spec:
  terminationGracePeriodSeconds: 30  # Must be > shutdown.timeout
  containers:
    - name: my-service
      image: my-service:latest
      ports:
        - containerPort: 5000
      readinessProbe:
        httpGet:
          path: /healthz
          port: 5000
        periodSeconds: 5
      lifecycle:
        preStop:
          exec:
            # Give load balancers time to remove this pod
            command: ["sleep", "5"]
```

### Shutdown Timeline

```
0s    SIGTERM received (Kubernetes sends SIGTERM)
0s    'stopping' event -> healthcheckManager.update(NOT_SERVING)
0-5s  Kubernetes removes pod from service endpoints
5s    In-flight requests drain
25s   Shutdown timeout (forceCloseOnTimeout: true)
25s   Shutdown hooks execute
25s   'stop' event
30s   Kubernetes terminationGracePeriodSeconds (hard kill)
```

::: danger Critical
Always set `shutdown.timeout` to a value **less than** Kubernetes `terminationGracePeriodSeconds`. Otherwise, Kubernetes may SIGKILL the process before your shutdown hooks complete.
:::

## Timeout and Force Close Behavior

### With forceCloseOnTimeout: true (default)

When the timeout is exceeded, all active HTTP/2 sessions are destroyed:

```typescript
shutdown: {
  timeout: 30000,
  forceCloseOnTimeout: true,  // default
}
```

This ensures the server stops within the timeout, even if clients hold connections open.

### With forceCloseOnTimeout: false

The server waits indefinitely for all in-flight requests to complete. Shutdown hooks still execute after the timeout:

```typescript
shutdown: {
  timeout: 30000,
  forceCloseOnTimeout: false,
}
```

::: warning
With `forceCloseOnTimeout: false`, the server may hang if a client holds a connection open indefinitely. Use only when you control all clients and can guarantee they will close connections.
:::

## Complete Production Example

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';
import { createDefaultInterceptors } from '@connectum/interceptors';
import { shutdownProvider } from '@connectum/otel';
import routes from '#gen/routes.js';

const server = createServer({
  services: [routes],
  port: 5000,
  protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
  interceptors: createDefaultInterceptors(),
  shutdown: {
    autoShutdown: true,
    timeout: 25000,
    forceCloseOnTimeout: true,
  },
});

// Register shutdown hooks with dependencies
server.onShutdown('database', async () => {
  await db.close();
});

server.onShutdown('cache', async () => {
  await redis.quit();
});

server.onShutdown('otel', ['database', 'cache'], async () => {
  await shutdownProvider();
});

// Lifecycle hooks
server.on('ready', () => {
  healthcheckManager.update(ServingStatus.SERVING);
});

server.on('stopping', () => {
  healthcheckManager.update(ServingStatus.NOT_SERVING);
});

server.on('stop', () => {
  console.log('Server stopped');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

await server.start();
```

## Next Steps

- [Health Checks](/en/guide/health-checks) -- configure health monitoring for Kubernetes
- [TLS Configuration](/en/guide/tls) -- secure communication
- [Observability](/en/guide/observability) -- flush telemetry on shutdown
- [Quickstart](/en/guide/quickstart) -- complete tutorial
