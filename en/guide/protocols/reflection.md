---
outline: deep
---

# Server Reflection

Server Reflection allows clients to discover services, methods, and message types at runtime without access to `.proto` files. Connectum implements the [gRPC Server Reflection Protocol](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md) (v1 and v1alpha) through the `@connectum/reflection` package.

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

```bash
pnpm add @connectum/reflection
```

Peer dependency: `@connectum/core`.

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

That is all you need. The `Reflection()` factory creates a `ProtocolRegistration` that registers the `grpc.reflection.v1.ServerReflection` service on your server.

## How It Works

When you pass `Reflection()` to the `protocols` array, Connectum:

1. Collects all registered service file descriptors from your services
2. Builds a `FileDescriptorSet` from those descriptors and their dependencies
3. Registers the `grpc.reflection.v1.ServerReflection` service on the ConnectRouter
4. Clients can then query the reflection service to discover available services

The reflection service is registered **after** your application services, so it has access to all registered service descriptors.

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
grpc.reflection.v1.ServerReflection
```

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
# grpc.reflection.v1.ServerReflection

# Describe the order service
grpcurl -plaintext localhost:5000 describe order.v1.OrderService
```

## collectFileProtos Utility

The `collectFileProtos` utility function is also exported for advanced use cases. It collects file descriptor protos with their dependency tree:

```typescript
import { collectFileProtos } from '@connectum/reflection';
```

This is used internally by the `Reflection()` factory to build the `FileDescriptorSet`.

## Protocol Registration Details

Under the hood, `Reflection()` returns a `ProtocolRegistration` object:

```typescript
{
  name: 'reflection',
  register(router, context) {
    // context.registry contains all registered service DescFile[]
    // Builds FileDescriptorSet and registers reflection service
  },
}
```

The `context.registry` is populated by `@connectum/core` during server startup, containing file descriptors from all registered services.

## Related

- [Protocols Overview](/en/guide/protocols) -- back to overview
- [Custom Protocols](/en/guide/protocols/custom) -- create your own protocol plugins
- [Health Checks](/en/guide/health-checks) -- health monitoring
- [@connectum/reflection](/en/packages/reflection) -- Package Guide
- [@connectum/reflection API](/en/api/@connectum/reflection/) -- Full API Reference
