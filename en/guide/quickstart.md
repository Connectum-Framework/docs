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
- **buf** -- installed automatically via `@bufbuild/buf` npm package

::: tip Node.js version for consumers
This guide uses Node.js 25+ for native `.ts` execution of your own source files. However, `@connectum/*` packages ship **compiled JavaScript**, so if you compile your own code (e.g., with tsx or a build tool), you can run on **Node.js >= 18.0.0**. See [Runtime Support](/en/guide/typescript#runtime-support-node-js-vs-bun).
:::

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

# Validation (recommended: @connectrpc/validate)
pnpm add @bufbuild/protovalidate @connectrpc/validate

# Dev dependencies (buf + code generation)
pnpm add -D typescript @types/node @bufbuild/buf @bufbuild/protoc-gen-es
```

Configure `package.json`:

```json
{
  "name": "greeter-service",
  "version": "1.0.0",
  "type": "module",
  "imports": {
    "#gen/*": "./gen/*",
    "#*": "./src/*"
  },
  "scripts": {
    "start": "node src/index.ts",
    "dev": "node --watch src/index.ts",
    "typecheck": "tsc --noEmit",
    "build:proto": "buf generate proto"
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

import "buf/validate/validate.proto";

service GreeterService {
  rpc SayHello(SayHelloRequest) returns (SayHelloResponse) {}
}

message SayHelloRequest {
  string name = 1 [(buf.validate.field).string.min_len = 1];
}

message SayHelloResponse {
  string message = 1;
}
```

Create `buf.yaml` to declare the validate dependency:

```yaml
version: v2
deps:
  - buf.build/bufbuild/protovalidate
```

Then fetch dependencies:

```bash
npx buf dep update
```

## 3. Code Generation

Create `buf.gen.yaml`:

```yaml
version: v2
plugins:
  - local: protoc-gen-es
    out: gen
    opt:
      - target=ts
      - import_extension=.ts
inputs:
  - directory: proto
```

Run code generation:

```bash
pnpm run build:proto
```

This produces `gen/greeter_pb.ts` containing message schemas, types, and the service definition.

::: warning Proto enums and native TypeScript
If your proto files use `enum`, the generated code contains non-erasable TypeScript. Use a [two-step generation process](/en/guide/typescript#proto-generation-and-enums).
:::

## 4. Service Handler

Create `src/services/greeterService.ts`:

```typescript
import { create } from '@bufbuild/protobuf';
import type { ConnectRouter } from '@connectrpc/connect';
import { GreeterService, SayHelloResponseSchema } from '#gen/greeter_pb.js';
import type { SayHelloRequest } from '#gen/greeter_pb.js';

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
# Node.js 25+ (native TypeScript)
pnpm dev

# Bun
bun src/index.ts

# tsx (Node.js 18+)
npx tsx src/index.ts
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
| **Validation** | Proto constraint validation via [@connectrpc/validate](https://github.com/connectrpc/validate-es) |
| **Health checks** | gRPC + HTTP endpoints |
| **Reflection** | Runtime service discovery |
| **Graceful shutdown** | SIGTERM/SIGINT with connection draining |

---

The following steps show how to extend your base service with additional framework features.

## 7. Test Validation

The `min_len = 1` rule from Step 2 is enforced automatically by the validation interceptor:

```bash
grpcurl -plaintext -d '{"name": ""}' localhost:5000 greeter.v1.GreeterService/SayHello
# ERROR: Code: InvalidArgument
# Message: validation error: name: value length must be at least 1 characters [string.min_len]
```

No application code required -- proto constraints are validated before your handler runs. See [Validation](/en/guide/validation) for the full constraint catalog.

## 8. Add TLS

Generate a self-signed certificate and add `tls` to `createServer`:

```bash
mkdir -p keys
openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 \
  -keyout keys/server.key -out keys/server.crt \
  -days 365 -nodes -subj '/CN=localhost'
```

```typescript
const server = createServer({
  // ...same options as Step 5, plus:
  tls: { dirPath: './keys' }, // looks for server.key and server.crt
});
```

```bash
grpcurl -insecure localhost:5000 list          # gRPC over TLS
curl -k https://localhost:5000/healthz          # HTTP over TLS
```

See [Security (TLS)](/en/guide/security) for `keyPath`/`certPath`, mTLS, and production recommendations.

## 9. Add Authentication & Authorization

```bash
pnpm add @connectum/auth
```

```typescript
import { createJwtAuthInterceptor, createAuthzInterceptor } from '@connectum/auth';

const jwtAuth = createJwtAuthInterceptor({
  jwksUri: 'https://auth.example.com/.well-known/jwks.json',
  issuer: 'https://auth.example.com/',
  audience: 'my-api',
  skipMethods: ['grpc.health.v1.Health/*', 'grpc.reflection.v1.ServerReflection/*'],
});

const authz = createAuthzInterceptor({
  defaultPolicy: 'deny',
  rules: [
    { name: 'public', methods: ['greeter.v1.GreeterService/*'], effect: 'allow' },
  ],
});

// Add before default interceptors
interceptors: [jwtAuth, authz, ...createDefaultInterceptors()],
```

The auth interceptor extracts `Authorization: Bearer <token>`, verifies the JWT against JWKS, and populates `AuthContext` -- accessible in handlers via `getAuthContext()`. The authz interceptor evaluates declarative rules against that context.

See [Auth & Authorization](/en/guide/auth) for HMAC secrets, gateway auth, session-based auth, and RBAC with roles/scopes.

## 10. Add Observability

```bash
pnpm add @connectum/otel
```

```typescript
import { createOtelInterceptor } from '@connectum/otel';

// Add as first interceptor (before auth and defaults)
interceptors: [
  createOtelInterceptor({ serverPort: 5000 }),
  ...createDefaultInterceptors(),
],
```

```bash
OTEL_SERVICE_NAME=greeter-service
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

Every RPC now produces traces and metrics following [OTel semantic conventions](https://opentelemetry.io/docs/specs/semconv/rpc/connect-rpc/). See [Observability](/en/guide/observability) for correlated logging, deep tracing, and Grafana dashboards.

## 11. Graceful Shutdown Hooks

The `shutdown: { autoShutdown: true }` option from Step 5 handles SIGTERM/SIGINT. Register hooks for resource cleanup:

```typescript
server.onShutdown('database', async () => { await db.close(); });
server.onShutdown('cache', ['database'], async () => { await redis.quit(); });
```

Hooks execute in dependency order -- `cache` waits for `database` to complete. Use `server.shutdownSignal` to cancel long-running operations. Override defaults:

```typescript
shutdown: { autoShutdown: true, timeout: 15_000, signals: ['SIGTERM', 'SIGINT'] },
```

See [Graceful Shutdown](/en/guide/server/graceful-shutdown) for dependency graphs and Kubernetes integration.

## 12. Built-in Interceptors

`createDefaultInterceptors()` assembles 8 interceptors in a fixed order:

| # | Interceptor | Default | Purpose |
|---|-------------|---------|---------|
| 1 | **errorHandler** | on | Normalize errors to gRPC status codes |
| 2 | **timeout** | 30s | Enforce per-request deadline |
| 3 | **bulkhead** | 10/10 | Limit concurrent requests + queue |
| 4 | **circuitBreaker** | 5 failures | Prevent cascading failures |
| 5 | **retry** | 3 retries | Exponential backoff for transients |
| 6 | **fallback** | off | Graceful degradation (requires handler) |
| 7 | **validation** | on | Proto constraint validation |
| 8 | **serializer** | on | JSON serialization |

```typescript
const interceptors = createDefaultInterceptors({
  retry: false,
  timeout: { duration: 10_000 },
  bulkhead: { maxConcurrent: 20, maxQueue: 50 },
});
```

See [Interceptors](/en/guide/interceptors) for the full options reference and custom interceptors.

## 13. Sync Contracts with CLI

When Reflection is enabled, clients can sync proto types without `.proto` files:

```bash
pnpm add -D @connectum/cli
npx connectum proto sync --from localhost:5000 --out ./gen --dry-run  # discover
npx connectum proto sync --from localhost:5000 --out ./gen            # generate
```

## 14. Call Another Service

Microservices communicate via gRPC clients. Create a transport with `createClient` and add observability with `createOtelClientInterceptor`:

```typescript
import { createClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { createOtelClientInterceptor } from '@connectum/otel';
import { InventoryService } from '#gen/inventory_pb.js';

const inventoryTransport = createGrpcTransport({
  baseUrl: `http://${process.env.INVENTORY_HOST}:${process.env.INVENTORY_PORT}`,
  httpVersion: '2',
  interceptors: [
    createOtelClientInterceptor({
      serverAddress: process.env.INVENTORY_HOST!,
      serverPort: Number(process.env.INVENTORY_PORT),
    }),
  ],
});

const inventoryClient = createClient(InventoryService, inventoryTransport);

// Use in any service handler
const stock = await inventoryClient.checkStock({ sku: 'ABC-123' });
```

Trace context propagates automatically -- the client span links to the server span in the downstream service. See [Service Communication](/en/guide/service-communication) for patterns, resilience, and service discovery.

## Next Steps

You've built a microservice with validation, TLS, auth, observability, and resilience. Dive deeper:

- [About Connectum](/en/guide/about) -- framework design decisions and philosophy
- [Server](/en/guide/server) -- lifecycle, configuration, graceful shutdown
- [Interceptors](/en/guide/interceptors) -- built-in chain, custom interceptors, method filtering
- [Service Communication](/en/guide/service-communication) -- inter-service calls, patterns, client interceptors
- [Auth & Authorization](/en/guide/auth) -- JWT, gateway, session, RBAC, proto-based authz
- [Observability](/en/guide/observability) -- tracing, metrics, correlated logging
- [Health Checks](/en/guide/health-checks) -- gRPC/HTTP protocol, Kubernetes probes
- [Security (TLS)](/en/guide/security) -- TLS, mTLS, certificate management
- [Protocols](/en/guide/protocols) -- server reflection, custom protocol plugins
- [Validation](/en/guide/validation) -- proto constraint catalog
- [TypeScript](/en/guide/typescript) -- native runtime support, erasable syntax patterns
- [Testing](/en/guide/testing) -- integration testing strategies
- [Production](/en/guide/production/architecture) -- Docker, Kubernetes, Envoy Gateway
