---
title: Configure Kubernetes Probes
description: Connect Kubernetes liveness and readiness probes to Connectum health status.
docType: how-to
outline: deep
---

# Kubernetes Integration

Configure Kubernetes liveness and readiness probes with Connectum health checks,
and report health status during graceful shutdown.

## HTTP Probes

The HTTP probe examples below use HTTP/1.1. For a plaintext Connectum server,
keep `allowHTTP1: true` (the default). A plaintext h2c server uses
`allowHTTP1: false`; use the gRPC probes below for that configuration.

The built-in `/healthz`, `/health`, and `/readyz` endpoints report the same
aggregate status. They do not maintain separate liveness and readiness states;
use them only when the same dependency and service failures should affect both
probes. See [Health protocol](/en/guide/health-checks/protocol) for the status
model.

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

## gRPC Probes (Kubernetes 1.27+) {#grpc-probes-kubernetes-124}

Built-in gRPC probes are [stable since Kubernetes 1.27](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe).
The following probes use a plaintext gRPC endpoint:

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

Configure a plaintext HTTP/2 transport with `allowHTTP1: false` and register
`Healthcheck()` on the server. The default plaintext HTTP/1.1 transport cannot
serve these gRPC probes. See [Transport configuration](/en/guide/server/configuration).

## Graceful Shutdown Integration

Report service status through lifecycle events:

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
// Subsequent readiness probes observe NOT_SERVING
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

The `stopping` handler marks health status `NOT_SERVING`. Pod termination and
readiness updates are managed separately by Kubernetes. Leave enough grace time
for `preStop`, request draining, and hooks; see the canonical
[graceful shutdown timeline](/en/guide/server/graceful-shutdown#shutdown-timeline)
for the complete sequence and timing boundaries.

::: danger Critical
`terminationGracePeriodSeconds` must cover more than `shutdown.timeout`: it also
includes `preStop` and shutdown hooks. Use the budget described in the linked
shutdown guide; otherwise Kubernetes may kill the process before cleanup finishes.
:::

## Related

- [Health Checks Overview](/en/guide/health-checks) -- back to overview
- [Protocol Details](/en/guide/health-checks/protocol) -- gRPC methods, HTTP endpoints, configuration
- [Graceful Shutdown](/en/guide/server/graceful-shutdown) -- shutdown options, hooks, lifecycle events
- [Kubernetes Deployment](/en/guide/production/kubernetes) -- full deployment guide
- [@connectum/healthcheck](/en/packages/healthcheck) -- Package Guide
