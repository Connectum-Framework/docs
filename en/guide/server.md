---
title: Server
description: Understand the Connectum server boundary and choose the guide that owns each lifecycle task.
docType: concept
outline: deep
---

# Server

`createServer()` is the composition boundary for a Connectum process. It registers service routes, protocols and interceptors, selects the transport, and owns startup and shutdown. This page is the mental model; configuration values and lifecycle details live in their focused guides and generated API.

## Minimal server

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck } from '@connectum/healthcheck';
import { createDefaultInterceptors } from '@connectum/interceptors';
import { Reflection } from '@connectum/reflection';
import routes from '#gen/routes.js';

const server = createServer({
  services: [routes],
  port: 5000,
  protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
  interceptors: createDefaultInterceptors(),
  shutdown: { autoShutdown: true, timeout: 30_000 },
});

await server.start();
```

## Choose the owning guide

| Need | Canonical destination |
|---|---|
| Understand states, events, and `shutdownSignal` | [Lifecycle](/en/guide/server/lifecycle) |
| Configure listen address, TLS, environment, or schema extension | [Configuration](/en/guide/server/configuration) |
| Drain requests, coordinate hooks, and fit a deployment deadline | [Graceful shutdown](/en/guide/server/graceful-shutdown) |
| Select HTTP/1.1, h2c, or TLS/ALPN behavior | [Transport matrix](/en/guide/production/transport-matrix) |
| Find an exact server option or method | [`CreateServerOptions`](/en/api/@connectum/core/types/interfaces/CreateServerOptions) and [core API](/en/api/@connectum/core/) |

The stable state progression is `created → starting → running → stopping → stopped`. React to lifecycle events for application coordination; pass `server.shutdownSignal` to long-running work so cancellation follows the same shutdown boundary.

## Module route

Use the [`@connectum/core` module hub](/en/packages/core) for installation, the smallest package example, related guides, source, and API entry points.
