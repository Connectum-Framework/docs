---
title: Build Your First Connectum Service
description: Create a typed service, generate its proto contract, run it, and verify a successful RPC.
docType: tutorial
outline: deep
---

# Build Your First Connectum Service

Build your first service from a new project to one successful RPC. You will define a proto
contract, generate TypeScript, implement a handler, start a Connectum server, and
verify both the happy path and request validation.

**Outcome:** a runnable Greeter service with health checks, reflection, graceful
shutdown, error handling, and proto validation. Production capabilities such as
TLS, authentication, observability, and resilience are focused next steps rather
than prerequisites for your first call.

::: tip Prefer a scaffold?
`connectum init` downloads the version-pinned official `getting-started` base and
can add selected modules. Follow [Scaffolding a Service](/en/guide/scaffolding)
for that route. Continue here when you want to understand each file yourself.
:::

## Prerequisites

::: runtime
== node
- **Node.js >= 25.2.0** -- native TypeScript via [type stripping](https://nodejs.org/api/typescript.html)
- **pnpm >= 11** -- `corepack enable && corepack prepare pnpm@latest --activate`
- **buf** -- installed automatically via `@bufbuild/buf` npm package
== bun
- **Bun >= 1.3.6** -- TypeScript runs natively, no loader needed
- **buf** -- installed automatically via `@bufbuild/buf` npm package
:::

:::: runtime node
::: tip Node.js version for consumers
This guide uses Node.js 25+ for native `.ts` execution of your own source files. However, `@connectum/*` packages ship **compiled JavaScript**, so if you compile your own code (e.g., with tsx or a build tool), you can run on **Node.js >= 22.13.0**. See [Runtime Support](/en/guide/typescript/runtime-support).
:::
::::

::: runtime bun
Bun executes your TypeScript sources directly, and `@connectum/*` packages ship compiled
JavaScript, so nothing else is required. See
[Runtime Compatibility](/en/guide/runtime-compatibility) for the current support level.
:::

## 1. Project Setup

```bash
mkdir greeter-service && cd greeter-service
```

::: pm
== npm
```bash
npm init -y
```
== pnpm
```bash
pnpm init
```
== bun
```bash
bun init -y -m
```
:::

The Bun form passes `-m` so `bun init` writes only `package.json` and `tsconfig.json`
instead of also scaffolding a sample entry point and README.

Install dependencies:

::: pm
== npm
```bash
# Core framework
npm install @connectum/core @connectum/healthcheck @connectum/reflection @connectum/interceptors

# ConnectRPC runtime
npm install @connectrpc/connect @connectrpc/connect-node @bufbuild/protobuf

# Validation (recommended: @connectrpc/validate)
npm install @bufbuild/protovalidate @connectrpc/validate

# Dev dependencies (buf + code generation)
npm install -D typescript @types/node @bufbuild/buf @bufbuild/protoc-gen-es
```
== pnpm
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
== bun
```bash
# Core framework
bun add @connectum/core @connectum/healthcheck @connectum/reflection @connectum/interceptors

# ConnectRPC runtime
bun add @connectrpc/connect @connectrpc/connect-node @bufbuild/protobuf

# Validation (recommended: @connectrpc/validate)
bun add @bufbuild/protovalidate @connectrpc/validate

# Dev dependencies (buf + code generation)
bun add -d typescript @types/node @bufbuild/buf @bufbuild/protoc-gen-es
```
:::

Configure `package.json`:

::: runtime
== node
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
  "engines": { "node": ">=22.13.0" }
}
```
== bun
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
    "start": "bun src/index.ts",
    "dev": "bun --watch src/index.ts",
    "typecheck": "bunx tsc --noEmit",
    "build:proto": "buf generate proto"
  }
}
```
:::

Create `tsconfig.json` (type checking only -- no compilation):

```json
{
  "compilerOptions": {
    "noEmit": true,
    "target": "esnext",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "allowImportingTsExtensions": true,
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

::: pm
== npm
```bash
npx buf dep update
```
== pnpm
```bash
pnpm exec buf dep update
```
== bun
```bash
bunx buf dep update
```
:::

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

::: pm
== npm
```bash
npm run build:proto
```
== pnpm
```bash
pnpm run build:proto
```
== bun
```bash
bun run build:proto
```
:::

This produces `gen/greeter_pb.ts` containing message schemas, types, and the service definition.

::: warning Proto enums and native TypeScript
If your proto files use `enum`, the generated code contains non-erasable TypeScript. Use a [two-step generation process](/en/guide/typescript/proto-enums).
:::

## 4. Service Handler

Create `src/services/greeterService.ts`:

```typescript
import { create } from '@bufbuild/protobuf';
import { defineService } from '@connectum/core';
import { GreeterService, SayHelloResponseSchema } from '#gen/greeter_pb.ts';
import type { SayHelloRequest } from '#gen/greeter_pb.ts';

export const greeterService = defineService(GreeterService, {
  async sayHello(request: SayHelloRequest) {
    const name = request.name || 'World';
    return create(SayHelloResponseSchema, {
      message: `Hello, ${name}!`,
    });
  },
});
```

## 5. Server Entry Point

Create `src/index.ts`:

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';
import { createDefaultInterceptors } from '@connectum/interceptors';
import { greeterService } from './services/greeterService.ts';

const server = createServer({
  services: [greeterService],
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

::: runtime
== node
```bash
# Node.js 25+ (native TypeScript)
pnpm dev

# tsx (Node.js 22+)
npx tsx src/index.ts
```
== bun
```bash
bun --watch src/index.ts
```
:::

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
| **Validation** | Proto constraint validation via [@connectrpc/validate](https://github.com/connectrpc/validate-es) |
| **Health checks** | gRPC + HTTP endpoints |
| **Reflection** | Runtime service discovery |
| **Graceful shutdown** | SIGTERM/SIGINT with connection draining |

Resilience interceptors (timeout, bulkhead, circuit breaker, retry) are **opt-in**.
Add them after the first call works by following the [built-in interceptor guide](/en/guide/interceptors/built-in).

## 7. Verify Validation {#7-test-validation}

The `min_len = 1` rule from Step 2 is enforced automatically by the validation interceptor:

```bash
grpcurl -plaintext -d '{"name": ""}' localhost:5000 greeter.v1.GreeterService/SayHello
# ERROR: Code: InvalidArgument
# Message: validation error: name: value length must be at least 1 characters [string.min_len]
```

No application code is required: proto constraints are validated before your
handler runs. See [Validation](/en/guide/validation) for constraint setup and
failure handling.

## Next Steps

Your first service is complete. Choose the next task; none is required to finish
this tutorial.

<span id="8-add-tls"></span>
<span id="9-add-authentication--authorization"></span>
<span id="10-add-observability"></span>
<span id="11-graceful-shutdown-hooks"></span>
<span id="12-built-in-interceptors"></span>
<span id="13-sync-contracts-with-cli"></span>
<span id="14-call-another-service"></span>

| Goal | Continue with |
|---|---|
| Protect traffic | [TLS and mTLS](/en/guide/security), then [authentication and authorization](/en/guide/auth) |
| Observe the service | [Tracing, metrics, and logging](/en/guide/observability) |
| Tune lifecycle behavior | [Graceful Shutdown](/en/guide/server/graceful-shutdown) |
| Add resilience deliberately | [Built-in Interceptor Chain](/en/guide/interceptors/built-in) |
| Sync reflected contracts | [Server Reflection](/en/guide/protocols/reflection) and [`@connectum/cli`](/en/packages/cli) |
| Call another service | [Choosing a Communication Mechanism](/en/guide/service-communication/choosing-a-mechanism) |
| Test the service | [Testing](/en/guide/testing) |
| Deploy it | [Docker](/en/guide/production/docker) and [Kubernetes](/en/guide/production/kubernetes) |

## Troubleshooting

- Generation fails: review the `buf.yaml`, `buf.gen.yaml`, and import extension,
  then see [TypeScript and proto generation](/en/guide/typescript).
- The server starts but calls fail: confirm port, plaintext/TLS mode, and the
  fully-qualified service name with [Server Reflection](/en/guide/protocols/reflection).
- Node.js or Bun behaves differently: use the canonical
  [Runtime Compatibility](/en/guide/runtime-compatibility) matrix.
