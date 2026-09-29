---
title: Create a Custom Protocol
description: Extend the Connectum server with an advanced gRPC registration or HTTP fallback handler.
docType: how-to
outline: deep
---

# Creating Custom Protocol Plugins

Connectum uses a protocol plugin system to extend the server with additional gRPC services and HTTP endpoints. Built-in protocols include `Healthcheck` and `Reflection`, but you can create your own.

This is an advanced framework extension point. To expose the standard reflection service, follow [Server reflection](/en/guide/protocols/reflection) rather than reimplementing it.

## The ProtocolRegistration Interface

Every protocol plugin implements the `ProtocolRegistration` interface exported from `@connectum/core`:

```typescript
interface ProtocolRegistration {
  /** Protocol name for identification (e.g. "healthcheck", "reflection") */
  readonly name: string;

  /** One-time initialization, called exactly once per server */
  setup?(context: ProtocolContext): void;

  /** Register protocol services on the router, once per router */
  register(router: ConnectRouter): void;

  /** Optional HTTP handler for fallback routing (e.g. /healthz endpoint) */
  httpHandler?: HttpHandler;
}
```

The `ProtocolContext` passed to `setup` provides access to registered service file descriptors:

```typescript
interface ProtocolContext {
  /** Service file descriptors registered before this protocol (frozen snapshot) */
  readonly registry: ReadonlyArray<DescFile>;
}
```

The optional `HttpHandler` is called for raw HTTP requests that do not match any ConnectRPC route:

```typescript
/**
 * @returns true if the request was handled, false otherwise
 */
type HttpHandler = (req: Http2ServerRequest, res: Http2ServerResponse) => boolean;
```

## How Protocols Are Registered

Protocols are passed to `createServer()` via the `protocols` array. A server builds more than one `ConnectRouter` from the same registration: one for the HTTP adapter and one for each in-process transport (`server.localClient()`, the catalog transport behind `ctx.call`). The two methods split along that line:

- **`setup(context)`** runs **exactly once per server**, immediately before the protocol's first `register()` — on `server.start()`, or earlier if an in-process client is created first. Put everything that reads the registry or has side effects here.
- **`register(router)`** runs **once per router** and must only add routes. It must not change state that other routers or the application can observe — otherwise the first in-process call would change what HTTP clients see.

A registration object belongs to **one server**. Whatever `setup` stores in it — the service list in the example below, the descriptor set of `Reflection()` — is that server's state. Passing the same object to a second server lets the second server's `setup` overwrite it, and the first server's later routers then serve the second server's data. Call the protocol factory once per server:

```typescript
const serverA = createServer({ services: [routesA], protocols: [Reflection()] });
const serverB = createServer({ services: [routesB], protocols: [Reflection()] });
```

Protocols are processed in array order. The `context.registry` a protocol receives in `setup` holds every mounted application service plus the services of the protocols listed **before** it, as a frozen snapshot. That is why `Healthcheck()` does not track its own `grpc.health.v1.Health` service, while a `Reflection()` listed after it does list it:

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';

const server = createServer({
  services: [routes],
  protocols: [
    Healthcheck({ httpEnabled: true }),
    Reflection(),
    myCustomProtocol,  // Your custom protocol
  ],
});
```

Protocols can also be added before starting the server:

```typescript
const server = createServer({ services: [routes] });
server.addProtocol(myCustomProtocol);
await server.start();
```

::: warning
Protocols must be added before calling `server.start()`. Adding a protocol after the server is running will throw an error.
:::

## Creating a Custom Protocol

### Minimal Example: Service Info Endpoint

A protocol that registers a gRPC service to return metadata about the running server:

```typescript
import type { ConnectRouter } from '@connectrpc/connect';
import type { ProtocolRegistration, ProtocolContext } from '@connectum/core';
import { InfoService } from '#gen/info_pb.js';

function ServerInfo(): ProtocolRegistration {
  const startedAt = new Date().toISOString();
  let serviceNames: string[] = [];

  return {
    name: 'server-info',

    // Once per server: read the registry and keep the result.
    setup(context: ProtocolContext): void {
      serviceNames = context.registry.flatMap(
        (file) => file.services.map((s) => s.typeName),
      );
    },

    // Once per router: only add routes, reusing what setup computed, so HTTP
    // and in-process clients get identical answers.
    register(router: ConnectRouter): void {
      router.service(InfoService, {
        getInfo: () => ({
          startedAt,
          serviceCount: serviceNames.length,
          services: serviceNames,
        }),
      });
    },
  };
}
```

### With HTTP Handler

Add a raw HTTP endpoint alongside the gRPC service. The `httpHandler` function receives HTTP/2 requests that do not match any ConnectRPC route. Return `true` if you handled the request, `false` to pass it along:

```typescript
import type { Http2ServerRequest, Http2ServerResponse } from 'node:http2';
import type { ProtocolRegistration } from '@connectum/core';

function CustomHealthEndpoint(): ProtocolRegistration {
  const protocol: ProtocolRegistration = {
    name: 'custom-health',

    register(_router): void {
      // No gRPC service needed -- HTTP-only protocol
    },

    httpHandler(req: Http2ServerRequest, res: Http2ServerResponse): boolean {
      if (req.url === '/healthz' && req.method === 'GET') {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', timestamp: Date.now() }));
        return true;
      }
      return false;
    },
  };

  return protocol;
}
```

::: tip
The built-in `Healthcheck` protocol already provides HTTP health endpoints at `/healthz`, `/health`, and `/readyz` when `httpEnabled: true` is set. Use a custom HTTP handler only when you need non-standard behavior.
:::

## Example: Prometheus Metrics Endpoint

A protocol that exposes a `/metrics` HTTP endpoint for Prometheus scraping:

```typescript
import type { Http2ServerRequest, Http2ServerResponse } from 'node:http2';
import type { ProtocolRegistration } from '@connectum/core';

function Metrics(options: {
  path?: string;
  collect: () => string;
}): ProtocolRegistration {
  const { path = '/metrics', collect } = options;

  return {
    name: 'prometheus-metrics',

    register(): void {
      // HTTP-only protocol, no gRPC service registration needed
    },

    httpHandler(req: Http2ServerRequest, res: Http2ServerResponse): boolean {
      if (req.url === path && req.method === 'GET') {
        res.writeHead(200, { 'content-type': 'text/plain; version=0.0.4; charset=utf-8' });
        res.end(collect());
        return true;
      }
      return false;
    },
  };
}
```

Usage:

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck } from '@connectum/healthcheck';

const server = createServer({
  services: [routes],
  protocols: [
    Healthcheck({ httpEnabled: true }),
    Metrics({
      path: '/metrics',
      collect: () => generatePrometheusMetrics(),
    }),
  ],
});
```

## Using ProtocolContext

The `context.registry` field passed to `setup` contains an array of `DescFile` objects (from `@bufbuild/protobuf`) representing the proto file descriptors of the application services and of the protocols listed before yours. This is how the built-in Reflection protocol discovers available services:

```typescript
setup(context): void {
  // List all registered service type names
  for (const file of context.registry) {
    for (const service of file.services) {
      console.log(`Registered: ${service.typeName}`);
      for (const method of service.methods) {
        console.log(`  - ${method.name} (${method.kind})`);
      }
    }
  }
}
```

## Protocol Design Guidelines

1. **Use the factory pattern** -- Return `ProtocolRegistration` from a function that accepts options. This matches the convention of `Healthcheck()` and `Reflection()`.

2. **Name your protocol** -- The `name` field is used for identification and logging. Choose a descriptive, lowercase name.

3. **One-time work in `setup()`, routes in `register()`** -- `register()` runs for every router the server builds, so anything with side effects there (initializing state, opening resources, reading the registry) would run again on the first in-process call. Compute once in `setup()`, capture the result in the closure, and let `register()` only call `router.service(...)`.

4. **Keep setup() and register() synchronous** -- Both signatures are synchronous. If you need async setup, do it before creating the protocol or inside the service handlers.

5. **Return `false` from httpHandler for unmatched routes** -- This allows other protocols and the default 404 handler to process the request.

6. **Use ProtocolContext for service discovery** -- Do not hardcode service names. Use `context.registry` in `setup()` to discover what services are available.

::: warning Upgrading from `register(router, context)`
Earlier releases passed `context` to `register()`. See [Custom protocols: setup/register split](/en/migration/protocol-setup) for the migration.
:::

## Related

- [Protocols Overview](/en/guide/protocols) -- back to overview
- [Server Reflection](/en/guide/protocols/reflection) -- built-in reflection protocol
- [Custom Interceptors](/en/guide/interceptors/custom) -- creating custom interceptor middleware
- [@connectum/core](/en/packages/core) -- Package Guide
- [@connectum/core API](/en/api/@connectum/core/) -- Full API Reference
