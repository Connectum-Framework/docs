---
title: Quickstart
description: Build and run a gRPC/ConnectRPC microservice with Connectum in 5 minutes.
outline: deep
---

# Quickstart

Build a fully functional gRPC/ConnectRPC microservice with health checks, server reflection, and production-ready interceptors.

## Prerequisites

- **Node.js >= 25.2.0** -- native TypeScript via [type stripping](https://nodejs.org/api/typescript.html)
- **pnpm >= 10** -- `corepack enable && corepack prepare pnpm@latest --activate`
- **protoc** -- Protocol Buffers compiler (`apt install protobuf-compiler` / `brew install protobuf`)

## 1. Project Setup

```bash
mkdir greeter-service && cd greeter-service
pnpm init
```

Install dependencies:

```bash
# Core framework
pnpm add @connectum/core @connectum/healthcheck @connectum/reflection @connectum/interceptors

# ConnectRPC runtime
pnpm add @connectrpc/connect @connectrpc/connect-node @bufbuild/protobuf

# Dev dependencies
pnpm add -D typescript @types/node @bufbuild/protoc-gen-es
```

Configure `package.json`:

```json
{
  "name": "greeter-service",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/index.ts",
    "dev": "node --watch src/index.ts",
    "typecheck": "tsc --noEmit",
    "build:proto": "protoc -I proto --plugin=protoc-gen-es=./node_modules/.bin/protoc-gen-es --es_out=gen --es_opt=target=ts proto/*.proto"
  },
  "engines": { "node": ">=25.2.0" }
}
```

Create `tsconfig.json` (type checking only -- no compilation):

```json
{
  "compilerOptions": {
    "noEmit": true,
    "target": "esnext",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "rewriteRelativeImportExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*.ts", "gen/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create project structure:

```bash
mkdir -p src/services gen proto
```

## 2. Proto Definition

Create `proto/greeter.proto`:

```protobuf
syntax = "proto3";

package greeter.v1;

service GreeterService {
  rpc SayHello(SayHelloRequest) returns (SayHelloResponse) {}
}

message SayHelloRequest {
  string name = 1;
}

message SayHelloResponse {
  string message = 1;
}
```

## 3. Code Generation

```bash
pnpm run build:proto
```

This produces `gen/greeter_pb.ts` (messages + schemas) and `gen/greeter_connect.ts` (service definition).

::: warning Proto enums and native TypeScript
If your proto files use `enum`, the generated code contains non-erasable TypeScript. Use a [two-step generation process](/en/guide/typescript#proto-generation-and-enums).
:::

## 4. Service Handler

Create `src/services/greeterService.ts`:

```typescript
import { create } from '@bufbuild/protobuf';
import type { ConnectRouter } from '@connectrpc/connect';
import { GreeterService, SayHelloResponseSchema } from '#gen/greeter_pb.ts';
import type { SayHelloRequest } from '#gen/greeter_pb.ts';

export function greeterServiceRoutes(router: ConnectRouter): void {
  router.service(GreeterService, {
    async sayHello(request: SayHelloRequest) {
      const name = request.name || 'World';
      return create(SayHelloResponseSchema, {
        message: `Hello, ${name}!`,
      });
    },
  });
}
```

## 5. Server Entry Point

Create `src/index.ts`:

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';
import { createDefaultInterceptors } from '@connectum/interceptors';
import { greeterServiceRoutes } from './services/greeterService.ts';

const server = createServer({
  services: [greeterServiceRoutes],
  port: 5000,
  protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
  interceptors: createDefaultInterceptors(),
  shutdown: { autoShutdown: true },
});

server.on('ready', () => {
  console.log(`Server ready on port ${server.address?.port}`);
  healthcheckManager.update(ServingStatus.SERVING);
});

server.on('stopping', () => {
  healthcheckManager.update(ServingStatus.NOT_SERVING);
});

server.on('error', (err) => console.error(err));

await server.start();
```

## 6. Run & Test

```bash
pnpm dev
```

### gRPC (grpcurl)

```bash
# List services (reflection)
grpcurl -plaintext localhost:5000 list

# Call SayHello
grpcurl -plaintext -d '{"name": "Alice"}' localhost:5000 greeter.v1.GreeterService/SayHello

# Health check
grpcurl -plaintext localhost:5000 grpc.health.v1.Health/Check
```

### HTTP/1.1 (curl)

```bash
# Call SayHello via ConnectRPC HTTP
curl -X POST http://localhost:5000/greeter.v1.GreeterService/SayHello \
  -H "Content-Type: application/json" \
  -d '{"name": "Bob"}'

# Health check
curl http://localhost:5000/healthz
```

## What You Get Out of the Box

| Feature | Details |
|---------|---------|
| **Error handling** | Automatic error normalization to gRPC status codes |
| **Timeout** | 30s default per request |
| **Bulkhead** | Max 10 concurrent requests + 10-item queue |
| **Circuit breaker** | Opens after 5 consecutive failures |
| **Retry** | 3 retries with exponential backoff |
| **Validation** | Proto constraint validation via protovalidate |
| **Health checks** | gRPC + HTTP endpoints |
| **Reflection** | Runtime service discovery |
| **Graceful shutdown** | SIGTERM/SIGINT with connection draining |

## Next Steps

- [Core Principles](/en/guide/core-principles) -- understand the framework design decisions
- [Interceptors](/en/guide/interceptors) -- customize the interceptor chain
- [TypeScript Best Practices](/en/guide/typescript) -- native TypeScript constraints
- [Health Checks](/en/guide/health-checks) -- configure for Kubernetes
- [Observability](/en/guide/observability) -- add tracing and metrics
