---
title: '@connectum/core'
description: Main server factory with protocol plugin system for Connectum
---

# @connectum/core

The central package of the Connectum framework. Provides `createServer()` -- a factory function that creates a production-ready gRPC/ConnectRPC server with explicit lifecycle control, protocol plugin system, graceful shutdown, and TLS support.

**Layer**: 0 (Server Foundation) -- zero internal dependencies

## Installation

```bash
pnpm add @connectum/core
```

**Requires**: Node.js >= 18.0.0 (packages ship compiled `.js` + `.d.ts` + source maps)

## Quick Start

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';
import routes from '#gen/routes.js';

const server = createServer({
  services: [routes],
  port: 5000,
  protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
  shutdown: { autoShutdown: true },
});

server.on('ready', () => {
  healthcheckManager.update(ServingStatus.SERVING);
  console.log(`Server ready on port ${server.address?.port}`);
});

server.on('error', (err) => console.error(err));

await server.start();
```

## API Reference

### `createServer(options)`

Factory function that creates an unstarted `Server` instance.

```typescript
function createServer(options: CreateServerOptions): Server;
```

The server is created in `CREATED` state. Call `server.start()` to begin accepting connections.

### `CreateServerOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `services` | `ServiceRoute[]` | **(required)** | Service routes to register on the ConnectRouter |
| `port` | `number` | `5000` | Server port |
| `host` | `string` | `"0.0.0.0"` | Server host to bind |
| `tls` | `TLSOptions` | `undefined` | TLS configuration for secure connections |
| `protocols` | `ProtocolRegistration[]` | `[]` | Protocol plugins (healthcheck, reflection, custom) |
| `shutdown` | `ShutdownOptions` | `{}` | Graceful shutdown configuration |
| `interceptors` | `Interceptor[]` | `[]` | ConnectRPC interceptors. When omitted or `[]`, no interceptors are applied. Use `createDefaultInterceptors()` from `@connectum/interceptors` for the production-ready chain. |
| `allowHTTP1` | `boolean` | `true` | Allow HTTP/1.1 connections |
| `handshakeTimeout` | `number` | `30000` | Handshake timeout in milliseconds |
| `http2Options` | `SecureServerOptions` | `undefined` | Additional HTTP/2 server options |

### `Server` Interface

Extends `EventEmitter`. Provides explicit lifecycle control.

#### Lifecycle Methods

```typescript
interface Server extends EventEmitter {
  /** Start the server. Throws if not in CREATED state. */
  start(): Promise<void>;

  /** Stop the server gracefully. Throws if not in RUNNING state. */
  stop(): Promise<void>;
}
```

#### State Properties

```typescript
interface Server {
  /** Current server address (null until started) */
  readonly address: AddressInfo | null;

  /** Whether server is currently running */
  readonly isRunning: boolean;

  /** Current server state */
  readonly state: ServerState;

  /** Underlying HTTP/2 transport (null until started) */
  readonly transport: Http2SecureServer | Http2Server | null;

  /** Registered service routes */
  readonly routes: ReadonlyArray<ServiceRoute>;

  /** Registered interceptors */
  readonly interceptors: ReadonlyArray<Interceptor>;

  /** Registered protocols */
  readonly protocols: ReadonlyArray<ProtocolRegistration>;
}
```

#### Runtime Operations (before `start()`)

```typescript
interface Server {
  /** Add a service route. Throws if server is already started. */
  addService(service: ServiceRoute): void;

  /** Add an interceptor. Throws if server is already started. */
  addInterceptor(interceptor: Interceptor): void;

  /** Add a protocol. Throws if server is already started. */
  addProtocol(protocol: ProtocolRegistration): void;
}
```

#### Shutdown Hooks

```typescript
interface Server {
  /** Register an anonymous shutdown hook */
  onShutdown(handler: ShutdownHook): void;

  /** Register a named shutdown hook */
  onShutdown(name: string, handler: ShutdownHook): void;

  /** Register a named shutdown hook with dependencies */
  onShutdown(name: string, dependencies: string[], handler: ShutdownHook): void;

  /** AbortSignal that is aborted when server begins shutdown */
  readonly shutdownSignal: AbortSignal;
}
```

### `ServerState`

```typescript
const ServerState = {
  CREATED: 'created',
  STARTING: 'starting',
  RUNNING: 'running',
  STOPPING: 'stopping',
  STOPPED: 'stopped',
} as const;
```

### `LifecycleEvent`

```typescript
const LifecycleEvent = {
  START: 'start',     // Emitted when server starts (before ready)
  READY: 'ready',     // Emitted when server is ready to accept connections
  STOPPING: 'stopping', // Emitted when server begins graceful shutdown
  STOP: 'stop',       // Emitted when server stops
  ERROR: 'error',     // Emitted on error
} as const;
```

### `ShutdownOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | `number` | `30000` | Timeout in ms for graceful shutdown |
| `signals` | `NodeJS.Signals[]` | `["SIGTERM", "SIGINT"]` | Signals to listen for |
| `autoShutdown` | `boolean` | `false` | Enable automatic graceful shutdown on signals |
| `forceCloseOnTimeout` | `boolean` | `true` | Force close HTTP/2 sessions when timeout exceeded |

### Protocol Plugin System

Protocols implement the `ProtocolRegistration` interface to register themselves on the server.

```typescript
interface ProtocolRegistration {
  readonly name: string;
  register(router: ConnectRouter, context: ProtocolContext): void;
  httpHandler?: HttpHandler;
}

interface ProtocolContext {
  readonly registry: ReadonlyArray<DescFile>;
}
```

### TLS Configuration

```typescript
interface TLSOptions {
  keyPath?: string;   // Path to TLS key file
  certPath?: string;  // Path to TLS certificate file
  dirPath?: string;   // Directory with server.key and server.crt
}
```

Utility functions:

```typescript
function getTLSPath(): string;
function readTLSCertificates(options?: TLSOptions): { key: Buffer; cert: Buffer };
```

### Environment Configuration (`@connectum/core/config`)

Type-safe environment configuration using Zod schemas (12-Factor App).

```typescript
import { parseEnvConfig, safeParseEnvConfig } from '@connectum/core/config';

const config = parseEnvConfig(); // throws on invalid config
const result = safeParseEnvConfig(); // returns { success, data/error }
```

| Environment Variable | Type | Default | Description |
|---------------------|------|---------|-------------|
| `PORT` | `number` | `5000` | Server port |
| `LISTEN` | `string` | `"0.0.0.0"` | Listen address |
| `LOG_LEVEL` | `"debug" \| "info" \| "warn" \| "error"` | `"info"` | Log level |
| `LOG_FORMAT` | `"json" \| "pretty"` | `"json"` | Log format |
| `LOG_BACKEND` | `"otel" \| "pino" \| "console"` | `"otel"` | Logger backend |
| `NODE_ENV` | `"development" \| "production" \| "test"` | `"development"` | Node environment |
| `HTTP_HEALTH_ENABLED` | `boolean` | `false` | Enable HTTP health endpoints |
| `HTTP_HEALTH_PATH` | `string` | `"/healthz"` | HTTP health endpoint path |
| `OTEL_SERVICE_NAME` | `string` | -- | OpenTelemetry service name |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | `string (URL)` | -- | OTLP exporter endpoint |
| `GRACEFUL_SHUTDOWN_ENABLED` | `boolean` | `true` | Enable graceful shutdown |
| `GRACEFUL_SHUTDOWN_TIMEOUT_MS` | `number` | `30000` | Shutdown timeout in ms |

## Server Lifecycle

```
CREATED ──start()──> STARTING ──> RUNNING ──stop()──> STOPPING ──> STOPPED
                         │                                │
                         └──(error)──> STOPPED            └──(error)──> STOPPED
```

Events are emitted in this order: `start` -> `ready` (success) or `error` (failure), then `stopping` -> `stop` (or `error`).

## Published Package Format

All `@connectum/*` packages are built with [tsup](https://tsup.egoist.dev/) and ship:

- **Compiled `.js` files** (ESM) -- ready to run on any ES module-capable runtime (Node.js 18+, Bun, tsx)
- **TypeScript declarations** (`.d.ts`) -- full type information for IDE support and type checking
- **Source maps** (`.js.map`) -- accurate stack traces pointing to the original TypeScript source

No special loader or register hook is needed. All runtimes can import `@connectum/*` packages directly.

See [Runtime Support: Node.js vs Bun vs tsx](/en/guide/typescript#runtime-support-node-js-vs-bun) for details.

## Exports Summary

| Export | Subpath | Description |
|--------|---------|-------------|
| `createServer` | `.` | Server factory function |
| `ServerState` | `.` | Server state constants |
| `LifecycleEvent` | `.` | Lifecycle event name constants |
| `getTLSPath`, `readTLSCertificates`, `tlsPath` | `.` | TLS utilities |
| `Server`, `CreateServerOptions`, `ShutdownOptions`, etc. | `.` | TypeScript types |
| `parseEnvConfig`, `safeParseEnvConfig`, schemas | `./config` | Env configuration |

## Related Packages

- **[@connectum/interceptors](./interceptors.md)** -- Resilience interceptor chain (Layer 1, optional)
- **[@connectum/healthcheck](./healthcheck.md)** -- Healthcheck protocol plugin (Layer 1, optional)
- **[@connectum/reflection](./reflection.md)** -- Server Reflection protocol plugin (Layer 1, optional)
- **[@connectum/otel](./otel.md)** -- OpenTelemetry instrumentation (Layer 2, optional)
