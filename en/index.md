---
layout: home
title: Connectum — Enterprise gRPC Framework
pageClass: home-page

hero:
  name: Connectum
  text: Enterprise gRPC Framework
  tagline: Designed to empower modern engineering and platform teams that ship mission-critical business logic
  image:
    light: /assets/splash.png
    dark: /assets/splash-dark.png
    alt: Connectum Framework
  actions:
    - theme: brand
      text: Get Started
      link: /en/guide/quickstart
    - theme: alt
      text: View on GitHub
      link: https://github.com/Connectum-Framework/connectum

features:
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.84z"/><path d="m2 12 8.58 3.91a2 2 0 0 0 1.66 0L20.74 12"/><path d="m2 17 8.58 3.91a2 2 0 0 0 1.66 0L20.74 17"/></svg>'
    title: Standardized Service Structure
    details: Opinionated production architecture with a single createServer() entry point. Predictable behavior across all your services — no glue code, no custom wiring.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>'
    title: Operational Safety Envelope
    details: Fixed-order interceptor chain — timeout, retry, circuit breaker, bulkhead, and fallback. Enterprise resilience patterns enforced by default.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
    title: Auth & Zero-Trust
    details: JWT, gateway, and session authentication with declarative RBAC. mTLS and proto-based authorization keep security alongside your API contract.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>'
    title: Full Observability Stack
    details: Distributed tracing, RPC metrics, and structured logging via OpenTelemetry. First-class instrumentation for both server and client calls.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m3 15 2 2 4-4"/></svg>'
    title: Proto-First Contract
    details: The .proto schema is your single source of truth — validation rules, authorization policies, and REST routing all defined alongside the API contract. One file governs the full request lifecycle.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>'
    title: Cloud-Native by Default
    details: Health and readiness probes, graceful shutdown with dependency ordering, TLS/mTLS, and server reflection. Kubernetes-ready from the first line of code.
---

## See It in Action

::: code-group

```protobuf [deployment.proto]
syntax = "proto3";
package platform.v1;

import "buf/validate/validate.proto";
import "google/api/annotations.proto";
import "connectum/auth/v1/options.proto";

service DeploymentService {
  option (connectum.auth.v1.service_auth) = {
    default_policy: "deny"
    default_requires: { roles: ["platform-engineer"] }
  };

  rpc CreateDeployment(CreateDeploymentRequest) returns (Deployment) {
    option (google.api.http) = { post: "/v1/deployments" body: "*" };
  }

  rpc GetDeployment(GetDeploymentRequest) returns (Deployment) {
    option (connectum.auth.v1.method_auth) = { public: true };
    option (google.api.http) = { get: "/v1/deployments/{deployment_id}" };
  }
}

message CreateDeploymentRequest {
  string namespace = 1 [(buf.validate.field).string.min_len = 1];
  string image = 2 [(buf.validate.field).string.pattern = "^[a-z0-9./:-]+$"];
  int32 replicas = 3 [(buf.validate.field).int32 = { gte: 1, lte: 100 }];
}

message GetDeploymentRequest {
  string deployment_id = 1 [(buf.validate.field).string.uuid = true];
}

message Deployment {
  string deployment_id = 1;
  string namespace = 2;
  string image = 3;
  int32 replicas = 4;
  string status = 5;
  string created_by = 6;
}
```

```typescript [deploymentService.ts]
import { create } from '@bufbuild/protobuf';
import type { ConnectRouter } from '@connectrpc/connect';
import { requireAuthContext } from '@connectum/auth';
import { getLogger, getMeter } from '@connectum/otel';
import { DeploymentService, DeploymentSchema } from '#gen/platform_pb.js';

const logger = getLogger('DeploymentService');
const deployments = getMeter().createCounter('platform.deployments.total');

export default (router: ConnectRouter) => {
  router.service(DeploymentService, {
    async createDeployment(req) {
      const auth = requireAuthContext();

      deployments.add(1, { namespace: req.namespace });
      logger.info('Deployment created', {
        namespace: req.namespace,
        image: req.image,
        createdBy: auth.subject,
      });

      return create(DeploymentSchema, {
        deploymentId: crypto.randomUUID(),
        namespace: req.namespace,
        image: req.image,
        replicas: req.replicas,
        status: 'PENDING',
        createdBy: auth.subject,
      });
    },
  });
};
```

```typescript [server.ts]
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';
import { createDefaultInterceptors } from '@connectum/interceptors';
import { createOtelInterceptor } from '@connectum/otel';
import { createJwtAuthInterceptor, createProtoAuthzInterceptor } from '@connectum/auth';
import routes from '#services/deploymentService.js';

const server = createServer({
  services: [routes],
  port: 5000,
  protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
  interceptors: [
    createOtelInterceptor({ serverPort: 5000 }),
    createJwtAuthInterceptor({ jwksUri: process.env.JWKS_URI! }),
    createProtoAuthzInterceptor(),
    ...createDefaultInterceptors(),
  ],
  shutdown: { autoShutdown: true },
});

server.on('ready', () => {
  healthcheckManager.update(ServingStatus.SERVING);
});

await server.start();
```

```bash [cli]
# Sync proto types from a running server (gRPC Server Reflection)
connectum proto sync --from localhost:5000 --out ./gen

# gRPC call (requires platform-engineer role)
grpcurl -d '{"namespace":"prod","image":"api:v2.1.0","replicas":3}' \
  -H "Authorization: Bearer $TOKEN" \
  localhost:5000 platform.v1.DeploymentService/CreateDeployment

# REST via Envoy Gateway (gRPC-JSON transcoding from google.api.http)
curl -X POST http://gateway:8080/v1/deployments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"namespace":"prod","image":"api:v2.1.0","replicas":3}'
```

:::
