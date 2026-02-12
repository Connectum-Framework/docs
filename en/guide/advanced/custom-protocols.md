---
title: Creating Custom Protocol Plugins
description: How to create custom protocol plugins using the ProtocolRegistration interface in Connectum.
---

# Creating Custom Protocol Plugins

Connectum uses a protocol plugin system to extend the server with additional gRPC services and HTTP endpoints. Built-in protocols include `Healthcheck` and `Reflection`, but you can create your own.

## The ProtocolRegistration Interface

Every protocol plugin implements the `ProtocolRegistration` interface exported from `@connectum/core`:

```typescript
interface ProtocolRegistration {
  /** Protocol name for identification (e.g. "healthcheck", "reflection") */
  readonly name: string;

  /** Register protocol services on the router */
  register(router: ConnectRouter, context: ProtocolContext): void;

  /** Optional HTTP handler for fallback routing (e.g. /healthz endpoint) */
  httpHandler?: HttpHandler;
}
```

The `ProtocolContext` provides access to registered service file descriptors:

```typescript
interface ProtocolContext {
  /** Registered service file descriptors */
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

Protocols are passed to `createServer()` via the `protocols` array. During `server.start()`, each protocol's `register()` method is called with the ConnectRouter and a context containing all registered service file descriptors:

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

  return {
    name: 'server-info',

    register(router: ConnectRouter, context: ProtocolContext): void {
      const serviceNames = context.registry.flatMap(
        (file) => file.services.map((s) => s.typeName),
      );

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
import type { ProtocolRegistration, ProtocolContext } from '@connectum/core';

function CustomHealthEndpoint(): ProtocolRegistration {
  const protocol: ProtocolRegistration = {
    name: 'custom-health',

    register(_router, _context): void {
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

The `context.registry` field contains an array of `DescFile` objects (from `@bufbuild/protobuf`) representing the proto file descriptors of all registered services. This is how the built-in Reflection protocol discovers available services:

```typescript
register(router, context): void {
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

3. **Keep register() synchronous** -- The `register` method signature is synchronous. If you need async setup, do it before creating the protocol or inside the service handlers.

4. **Return `false` from httpHandler for unmatched routes** -- This allows other protocols and the default 404 handler to process the request.

5. **Use ProtocolContext for service discovery** -- Do not hardcode service names. Use `context.registry` to discover what services are available.

## Related

- [Custom Interceptors](./custom-interceptors.md) -- Creating custom interceptor middleware
- [Method Filtering](./method-filtering.md) -- Per-method interceptor routing
- [Configuration](./configuration.md) -- Environment-based server configuration
