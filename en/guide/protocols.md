---
outline: deep
---

# Protocols

Protocol plugin system for extending Connectum servers with custom gRPC services and HTTP endpoints.

## Quick Start

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';
import routes from '#gen/routes.js';

const server = createServer({
  services: [routes],
  port: 5000,
  protocols: [
    Healthcheck({ httpEnabled: true }),
    Reflection(),
  ],
});

await server.start();
```

## Key Concepts

| Concept | Description |
|---------|-------------|
| **ProtocolRegistration** | Interface with `name`, `register()`, and optional `httpHandler` |
| **Healthcheck** | Built-in protocol -- gRPC Health Check + HTTP endpoints (`/healthz`, `/health`, `/readyz`) |
| **Reflection** | Built-in protocol -- gRPC Server Reflection for runtime service discovery |
| **Custom Protocols** | Implement `ProtocolRegistration` to add gRPC services or HTTP endpoints |
| **addProtocol()** | Add protocols dynamically before `server.start()` |

Every protocol's `register()` receives a `ConnectRouter` and a `ProtocolContext` with all registered service file descriptors.

## Learn More

- [Server Reflection](/en/guide/protocols/reflection) -- runtime service discovery, grpcurl, buf curl, Postman
- [Custom Protocols](/en/guide/protocols/custom) -- ProtocolRegistration interface, HTTP handlers, examples
- [@connectum/healthcheck](/en/packages/healthcheck) -- Health Check Package Guide
- [@connectum/reflection](/en/packages/reflection) -- Reflection Package Guide
