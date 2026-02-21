---
title: '@connectum/reflection'
description: gRPC Server Reflection protocol plugin for Connectum
---

# @connectum/reflection

Implements the [gRPC Server Reflection Protocol](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md) (v1 + v1alpha) as a Connectum protocol plugin. Allows clients like `grpcurl`, Postman, and `buf curl` to discover services, methods, and message types at runtime without requiring proto files.

**Layer**: 1 (Protocol)

::: tip Full API Reference
Complete TypeScript API documentation: [API Reference](/en/api/@connectum/reflection/)
:::

## Installation

```bash
pnpm add @connectum/reflection
```

**Peer dependency**: `@connectum/core`

**Internal dependency**: Uses `@lambdalisue/connectrpc-grpcreflect` for the reflection implementation.

## Quick Start

```typescript
import { createServer } from '@connectum/core';
import { Reflection } from '@connectum/reflection';

const server = createServer({
  services: [routes],
  protocols: [Reflection()],
});

await server.start();

// Clients can now discover services via gRPC Server Reflection
```

## API Reference

### `Reflection()`

Factory function that creates a `ProtocolRegistration` for the gRPC Server Reflection protocol.

```typescript
function Reflection(): ProtocolRegistration;
```

The function takes no arguments. It automatically collects all registered service file descriptors from the `ProtocolContext` and builds a `FileDescriptorSet` for the reflection service.

Pass the result to `createServer({ protocols: [...] })`.

### `collectFileProtos(files)`

Utility function that recursively collects `FileDescriptorProto` objects from `DescFile` entries, including transitive dependencies. Deduplicates by file name using depth-first traversal.

```typescript
function collectFileProtos(files: ReadonlyArray<DescFile>): DescFile['proto'][];
```

This is primarily used internally by `Reflection()` but is exported for advanced use cases.

## How It Works

When the server starts, the `Reflection` protocol:

1. Receives all registered service file descriptors via `ProtocolContext.registry`
2. Recursively collects all proto file descriptors and their dependencies using `collectFileProtos()`
3. Builds a `FileDescriptorSet` from the collected protos
4. Registers the `ServerReflection` service (v1 and v1alpha) on the ConnectRouter

## Usage with grpcurl

`grpcurl` is the most common client for gRPC Server Reflection:

```bash
# List all services
grpcurl -plaintext localhost:5000 list

# Describe a service
grpcurl -plaintext localhost:5000 describe my.service.v1.MyService

# Describe a method
grpcurl -plaintext localhost:5000 describe my.service.v1.MyService.GetUser

# Call a method (reflection provides the schema)
grpcurl -plaintext -d '{"id": "123"}' \
  localhost:5000 my.service.v1.MyService/GetUser
```

## Usage with buf curl

```bash
# List services
buf curl --protocol grpc --http2-prior-knowledge http://localhost:5000 --list-methods

# Call a method
buf curl --protocol grpc --http2-prior-knowledge \
  -d '{"id": "123"}' \
  http://localhost:5000/my.service.v1.MyService/GetUser
```

## Combined with Healthcheck

Reflection and Healthcheck are typically used together:

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';

const server = createServer({
  services: [routes],
  protocols: [
    Healthcheck({ httpEnabled: true }),
    Reflection(),
  ],
  shutdown: { autoShutdown: true },
});

server.on('ready', () => {
  healthcheckManager.update(ServingStatus.SERVING);
});

await server.start();
```

## Exports Summary

| Export | Description |
|--------|-------------|
| `Reflection` | Protocol registration factory |
| `collectFileProtos` | Utility to collect file descriptors with dependencies |

## Related Packages

- **[@connectum/core](./core.md)** -- Server that hosts this protocol (peer dependency)
- **[@connectum/healthcheck](./healthcheck.md)** -- Companion protocol for health monitoring
- **[@connectum/cli](./cli.md)** -- CLI tool that uses reflection for `proto sync`
