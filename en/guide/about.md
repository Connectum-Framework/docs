---
outline: deep
---

# About Connectum

## What is Connectum?

**Connectum** is a minimalistic, extensible framework for building production-ready gRPC/ConnectRPC microservices on Node.js 18+.

## The Problem

Building production-ready gRPC/ConnectRPC microservices on Node.js requires:

- A lot of boilerplate code
- Manual observability setup (tracing, metrics, logging)
- Integration of health checks and graceful shutdown
- TLS, validation, and reflection configuration
- Understanding multiple libraries and their interactions

Existing solutions (NestJS, tRPC) are either too heavy or lack native gRPC support.

## The Solution

Connectum provides:

- **Zero boilerplate** for a basic service
- **Production-ready out of the box** -- OTEL, health checks, TLS
- **Pluggable architecture** via peerDependencies
- **Native TypeScript** -- write TypeScript, publish compiled JavaScript + type declarations. Works on any runtime (Node.js 18+, Bun, Deno). Full source maps for IDE jump-to-source.
- **Explicit Lifecycle** -- full control over server lifecycle

## Target Audience

- **Open-source community** -- developers of all experience levels
- **API gateways** and business services
- **Workers** and data pipelines
- **DevOps/SRE** -- standard Kubernetes probes and OTEL collector

## Key Features

### Core

| Feature | Description |
|---------|-------------|
| gRPC/ConnectRPC Server | HTTP/2 server with gRPC, ConnectRPC, and gRPC-Web support |
| TLS Support | Built-in TLS, mTLS, auto-reload certificates |
| Health Checks | gRPC Health protocol + HTTP `/healthz`, `/readyz` endpoints |
| Graceful Shutdown | Drain connections, configurable timeout, shutdown hooks |
| Interceptors Chain | Standard ConnectRPC Interceptor API with ordered execution |
| OpenTelemetry | Distributed tracing, RPC metrics, structured logging |
| Server Reflection | gRPC Server Reflection for grpcurl and similar tools |
| Input Validation | protovalidate integration for automatic validation |
| CLI Tools | Code generation, project scaffolding |
| Testing | protofake integration, in-memory transport, test fixtures |

### Packages

Connectum is composed of modular packages organized across dependency layers:

```
@connectum/
├── core               # Layer 0: Server Foundation (zero internal deps)
├── interceptors       # Layer 1: Interceptors chain
├── healthcheck        # Layer 1: gRPC Health Check
├── reflection         # Layer 1: Server Reflection
├── otel               # Layer 2: OpenTelemetry
└── testing            # Layer 2: Testing utilities
```

**Layer 0 (Server Foundation):** `core` -- zero internal dependencies, only external NPM packages.

**Layer 1 (Extensions):** Interceptors, protocols -- depends on Layer 0 or external packages.

**Layer 2 (Tools):** Observability, testing -- can depend on all layers.

## Example: Hello World

```typescript
import { createServer } from '@connectum/core';
import routes from '#gen/routes.js';

const server = createServer({
  services: [routes],
  port: 5000,
});

await server.start();
console.log(`Server running at ${server.address?.port}`);
```

## Example: Production

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';
import { createDefaultInterceptors } from '@connectum/interceptors';
import { createOtelInterceptor } from '@connectum/otel';
import routes from '#gen/routes.js';

const server = createServer({
  services: [routes],
  port: Number(process.env.PORT) || 5000,
  tls: {
    cert: process.env.TLS_CERT,
    key: process.env.TLS_KEY,
  },
  protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
  interceptors: [
    ...createDefaultInterceptors(),
    createOtelInterceptor({ serviceName: 'my-service' }),
  ],
  shutdown: {
    autoShutdown: true,
    timeout: 30_000,
    forceCloseOnTimeout: true,
  },
});

// Shutdown hooks with dependency ordering
server.onShutdown('cache', async () => {
  await cache.flush();
});

server.onShutdown('database', ['cache'], async () => {
  await db.close();
});

server.on('ready', () => {
  healthcheckManager.update(ServingStatus.SERVING);
  console.log(`Server ready at ${server.address?.port}`);
});

server.on('stopping', () => {
  console.log('Server shutting down...');
});

await server.start();
```

## Non-Goals

- **Not an ORM** -- Connectum does not manage databases
- **Not a full-stack framework** -- gRPC/ConnectRPC server-side only
- **Not CommonJS** -- ESM only
- **Not legacy Node.js** -- requires Node.js 18+ (development requires Node.js 25+)

## Next Steps

- [Quickstart](/en/guide/quickstart) -- set up your first project in 5 minutes
- [Interceptors Guide](/en/guide/interceptors) -- learn about the interceptor chain
- [Architecture Overview](/en/guide/advanced/architecture) -- understand the design decisions

## External Resources

- [ConnectRPC Documentation](https://connectrpc.com/docs)
- [OpenTelemetry Node.js](https://opentelemetry.io/docs/instrumentation/js/)
- [gRPC Health Checking Protocol](https://github.com/grpc/grpc/blob/master/doc/health-checking.md)
- [protovalidate](https://github.com/bufbuild/protovalidate)
