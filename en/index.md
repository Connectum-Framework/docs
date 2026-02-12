---
layout: home
title: Connectum — Production-Ready gRPC Framework

hero:
  name: Connectum
  text: Production-Ready gRPC Framework
  tagline: Build resilient gRPC/ConnectRPC microservices on Node.js with zero boilerplate
  image:
    src: /assets/splash.png
    alt: Connectum Framework
  actions:
    - theme: brand
      text: Get Started
      link: /en/guide/quickstart
    - theme: alt
      text: View on GitHub
      link: https://github.com/Connectum-Framework/connectum

features:
  - icon: ⚡
    title: Native TypeScript
    details: Zero build step with Node.js 25.2.0+ stable type stripping. Write TypeScript, run directly.
  - icon: 🛡️
    title: Built-in Resilience
    details: 8 production interceptors out of the box — timeout, retry, circuit breaker, bulkhead, and more.
  - icon: 📊
    title: Full Observability
    details: OpenTelemetry traces, metrics, and structured logging with zero configuration.
  - icon: 🔌
    title: Protocol Plugins
    details: Extensible protocol system — health checks, server reflection, or build your own.
  - icon: 🏗️
    title: Explicit Lifecycle
    details: Full control over server startup, shutdown hooks, and dependency ordering.
  - icon: 📦
    title: Modular by Design
    details: 6 packages across 3 layers. Use only what you need — from core to CLI tools.
---

## Quick Example

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';
import { createDefaultInterceptors } from '@connectum/interceptors';
import routes from '#gen/routes.js';

const server = createServer({
    services: [routes],
    port: 5000,
    protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
    interceptors: createDefaultInterceptors(),
    shutdown: { autoShutdown: true },
});

server.on('ready', () => {
    healthcheckManager.update(ServingStatus.SERVING);
    console.log(`Server ready on port ${server.address?.port}`);
});

await server.start();
```
