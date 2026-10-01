---
title: Operate Server Reflection
description: Enable schema discovery for tools and control its production exposure.
docType: how-to
outline: deep
---

# Server Reflection

Server Reflection allows clients to discover services, methods, and message types at runtime without access to `.proto` files. Connectum implements the [gRPC Server Reflection Protocol](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md) (v1 and v1alpha) through the `@connectum/reflection` package.

This page owns operational enablement and client-tool usage. Implementing a new server extension belongs to [Custom protocols](/en/guide/protocols/custom).

## Why Use Reflection?

- **grpcurl**: List and call services without providing `.proto` files
- **Postman / Insomnia / [Warthog](https://github.com/Forest33/warthog)**: Auto-discover gRPC services for manual testing
- **buf curl**: Test ConnectRPC services with automatic schema resolution
- **Service registries**: Dynamic service discovery in microservice architectures
- **Development**: Explore APIs interactively during development

::: warning Production consideration
Server Reflection exposes your service schema to any client that can connect. In production environments, consider disabling it or restricting access.
:::

## Installation

::: pm
== npm
```bash
npm install @connectum/reflection
```
== pnpm
```bash
pnpm add @connectum/reflection
```
== bun
```bash
bun add @connectum/reflection
```
:::

Peer dependencies: `@connectum/core`, `@bufbuild/protobuf` `^2.16.0` and
`@connectrpc/connect` `^2.2.0` (see
[Peer dependencies on protobuf and Connect](/en/migration/peer-dependencies)).

## Quick Setup

```typescript
import { createServer } from '@connectum/core';
import { Reflection } from '@connectum/reflection';
import routes from '#gen/routes.js';

const server = createServer({
  services: [routes],
  port: 5000,
  protocols: [Reflection()],
});

await server.start();
```

That is all you need. The `Reflection()` factory creates a `ProtocolRegistration` that registers `grpc.reflection.v1.ServerReflection` and `grpc.reflection.v1alpha.ServerReflection` on your server.

## How It Works

When you pass `Reflection()` to the `protocols` array, Connectum:

1. Collects all registered service file descriptors from your services
2. Indexes those descriptors and their transitive imports by file name, by fully-qualified symbol and by extension
3. Registers the v1 and v1alpha `ServerReflection` services on the ConnectRouter
4. Clients can then query the reflection service to discover available services

Reflection is set up **after** your application services, so it has access to all of their descriptors. It also lists the services of protocols placed before it in the `protocols` array — with `[Healthcheck(), Reflection()]`, `grpc.health.v1.Health` is listed.

### Protocol Behavior

The answers follow the [reflection protocol](https://github.com/grpc/grpc-proto/blob/master/grpc/reflection/v1/reflection.proto):

| Request | Answer |
|---------|--------|
| `list_services` | The mounted services: application services and the protocols listed before `Reflection()`. Services that are declared but not mounted (in an imported file, or next to a mounted service in the same file) are not listed. |
| `file_by_filename`, `file_containing_symbol`, `file_containing_extension` | The requested file first, then each transitive import (well-known types included) not yet sent on the same stream. |
| `file_containing_symbol` | Resolves services, methods (`pkg.Service.Method`), messages, fields, oneofs, enums, enum values and extensions. Enum values are named in the scope that contains their enum (`pkg.LEVEL_HIGH`, not `pkg.Level.LEVEL_HIGH`). |
| `all_extension_numbers_of_type` | `base_type_name` set to the requested type, numbers in ascending order. |
| Unknown file, symbol, extension or type | `error_response` with `NOT_FOUND` (5), naming what was not found. |
| Request with no query set | `error_response` with `INVALID_ARGUMENT` (3). |

An error answers one request only; the stream stays open for the next one.

## Using grpcurl with Reflection

[grpcurl](https://github.com/fullstorydev/grpcurl) is the most common tool for interacting with reflection-enabled gRPC services.

### List All Services

```bash
grpcurl -plaintext localhost:5000 list
```

Output:

```
greeter.v1.GreeterService
grpc.health.v1.Health
```

The reflection service does not list itself: the listing is taken before reflection registers. Clients still reach it, which is how `list` works.

### Describe a Service

```bash
grpcurl -plaintext localhost:5000 describe greeter.v1.GreeterService
```

Output:

```
greeter.v1.GreeterService is a service:
service GreeterService {
  rpc SayHello ( .greeter.v1.SayHelloRequest ) returns ( .greeter.v1.SayHelloResponse );
}
```

### Describe a Method

```bash
grpcurl -plaintext localhost:5000 describe greeter.v1.GreeterService.SayHello
```

Output:

```
greeter.v1.GreeterService.SayHello is a method:
rpc SayHello ( .greeter.v1.SayHelloRequest ) returns ( .greeter.v1.SayHelloResponse );
```

Fields (`greeter.v1.SayHelloRequest.name`), enums and enum values can be described the same way.

### Describe a Message Type

```bash
grpcurl -plaintext localhost:5000 describe greeter.v1.SayHelloRequest
```

Output:

```
greeter.v1.SayHelloRequest is a message:
message SayHelloRequest {
  string name = 1;
}
```

### Call a Method

With reflection enabled, grpcurl does not need `-proto` or `-protoset` flags:

```bash
grpcurl -plaintext \
  -d '{"name": "Alice"}' \
  localhost:5000 \
  greeter.v1.GreeterService/SayHello
```

### With TLS

```bash
# Self-signed (development)
grpcurl -insecure localhost:5000 list

# With CA certificate
grpcurl -cacert keys/server.crt localhost:5000 list
```

## Using buf curl with Reflection

[buf curl](https://buf.build/docs/reference/cli/buf/curl/) supports ConnectRPC protocol and can use reflection:

```bash
# List services
buf curl --protocol connect --http2-prior-knowledge \
  http://localhost:5000 --list-services

# Call a method
buf curl --protocol connect --http2-prior-knowledge \
  -d '{"name": "Alice"}' \
  http://localhost:5000/greeter.v1.GreeterService/SayHello
```

## Using Postman / Insomnia / Warthog

Postman, Insomnia, and [Warthog](https://github.com/Forest33/warthog) support gRPC Server Reflection:

1. Create a new gRPC request
2. Enter the server URL: `localhost:5000`
3. Click "Use Server Reflection" (or similar)
4. The tool discovers and lists all available services and methods
5. Select a method, fill in the request payload, and send

## Conditional Reflection

Enable reflection only in non-production environments:

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';

const protocols = [Healthcheck({ httpEnabled: true })];

// Only enable reflection in development
if (process.env.NODE_ENV !== 'production') {
  protocols.push(Reflection());
}

const server = createServer({
  services: [routes],
  port: 5000,
  protocols,
});

server.on('ready', () => {
  healthcheckManager.update(ServingStatus.SERVING);
});

await server.start();
```

## Adding Reflection at Runtime

You can add reflection before starting the server using `addProtocol()`:

```typescript
const server = createServer({
  services: [routes],
  port: 5000,
});

// Conditionally add reflection
if (config.enableReflection) {
  server.addProtocol(Reflection());
}

await server.start();
```

::: warning
`addProtocol()` can only be called before `server.start()`. Attempting to add protocols after the server has started throws an error.
:::

## Complete Example

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';
import { createDefaultInterceptors } from '@connectum/interceptors';
import { greeterServiceRoutes } from './services/greeterService.ts';
import { orderServiceRoutes } from './services/orderService.ts';

const server = createServer({
  services: [greeterServiceRoutes, orderServiceRoutes],
  port: 5000,
  protocols: [
    Healthcheck({ httpEnabled: true }),
    Reflection(),
  ],
  interceptors: createDefaultInterceptors(),
  shutdown: { autoShutdown: true },
});

server.on('ready', () => {
  const port = server.address?.port;
  console.log(`Server ready on port ${port}`);
  console.log(`  grpcurl -plaintext localhost:${port} list`);
  healthcheckManager.update(ServingStatus.SERVING);
});

await server.start();
```

After starting, verify everything is discoverable:

```bash
# List all services
grpcurl -plaintext localhost:5000 list
# greeter.v1.GreeterService
# order.v1.OrderService
# grpc.health.v1.Health

# Describe the order service
grpcurl -plaintext localhost:5000 describe order.v1.OrderService
```

## collectFileProtos Utility

The `collectFileProtos` utility function is also exported for advanced use cases. It collects file descriptor protos with their dependency tree:

```typescript
import { collectFileProtos } from '@connectum/reflection';
```

This is used internally by the `Reflection()` factory to collect the descriptors it serves.

## Protocol Registration Details

Under the hood, `Reflection()` returns a `ProtocolRegistration` object:

```typescript
{
  name: 'reflection',
  setup(context) {
    // Before the first register: context.services and context.registry hold the
    // mounted application services and the protocols listed before
    // Reflection; indexes their descriptors
  },
  register(router) {
    // Once per router: mounts the v1 and v1alpha reflection services on that same index
  },
}
```

The context is a snapshot taken by `@connectum/core` when the server first builds its routes. Because the index is built in `setup` and shared by every router built after it, HTTP clients and in-process clients (`server.localClient()`, `ctx.call`) see the same listing. If that first route materialization fails, the retry runs `setup` again and rebuilds the index.

## Related

- [Protocols Overview](/en/guide/protocols) -- back to overview
- [Custom Protocols](/en/guide/protocols/custom) -- create your own protocol plugins
- [Health Checks](/en/guide/health-checks) -- health monitoring
- [@connectum/reflection](/en/packages/reflection) -- Package Guide
- [@connectum/reflection API](/en/api/@connectum/reflection/) -- Full API Reference
