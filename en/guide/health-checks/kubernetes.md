---
outline: deep
---

# Kubernetes Integration

Configure Kubernetes liveness and readiness probes with Connectum health checks, and integrate with graceful shutdown for zero-downtime deployments.

## HTTP Probes

HTTP probes are the simplest approach and work with all Kubernetes versions:

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: my-service
      image: my-service:latest
      ports:
        - containerPort: 5000
      livenessProbe:
        httpGet:
          path: /healthz
          port: 5000
        initialDelaySeconds: 5
        periodSeconds: 10
        failureThreshold: 3
      readinessProbe:
        httpGet:
          path: /readyz
          port: 5000
        initialDelaySeconds: 3
        periodSeconds: 5
        failureThreshold: 2
```

Requires `httpEnabled: true` in the Healthcheck protocol:

```typescript
protocols: [Healthcheck({ httpEnabled: true })]
```

## gRPC Probes (Kubernetes 1.24+)

Kubernetes 1.24+ supports gRPC health probes natively:

```yaml
livenessProbe:
  grpc:
    port: 5000
  initialDelaySeconds: 5
  periodSeconds: 10

readinessProbe:
  grpc:
    port: 5000
    service: my.service.v1.MyService
  initialDelaySeconds: 3
  periodSeconds: 5
```

gRPC probes use the `grpc.health.v1.Health/Check` method directly -- no HTTP endpoint needed.

## Graceful Shutdown Integration

Combine health checks with lifecycle events for zero-downtime deployments:

```typescript
import { createServer } from '@connectum/core';
import {
  Healthcheck,
  healthcheckManager,
  ServingStatus,
} from '@connectum/healthcheck';

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

// When shutdown begins, mark as NOT_SERVING
// Kubernetes stops routing traffic to this pod
server.on('stopping', () => {
  healthcheckManager.update(ServingStatus.NOT_SERVING);
});

await server.start();
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

## Shutdown Timeline

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

## Related

- [Health Checks Overview](/en/guide/health-checks) -- back to overview
- [Protocol Details](/en/guide/health-checks/protocol) -- gRPC methods, HTTP endpoints, configuration
- [Graceful Shutdown](/en/guide/server/graceful-shutdown) -- shutdown options, hooks, lifecycle events
- [Kubernetes Deployment](/en/guide/production/kubernetes) -- full deployment guide
- [@connectum/healthcheck](/en/packages/healthcheck) -- Package Guide
