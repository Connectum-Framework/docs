---
title: Protocol Extensions
description: Distinguish built-in operational protocols from custom server extensions.
docType: concept
outline: deep
---

# Protocol Extensions

The `protocols` array registers capabilities that share the server transport but are not application service routes. Connectum ships operational protocols for health and reflection; advanced consumers can implement the same registration contract for a custom gRPC service or HTTP fallback handler.

```typescript
const server = createServer({
  services: [routes],
  protocols: [
    Healthcheck({ httpEnabled: true }),
    Reflection(),
  ],
});
```

## Operational protocols

- [Health checks](/en/guide/health-checks) own readiness/liveness state and platform probes.
- [Server reflection](/en/guide/protocols/reflection) owns schema discovery, tool usage, and the production exposure warning.

## Advanced extension point

[Creating a custom protocol](/en/guide/protocols/custom) owns `ProtocolRegistration`, `ProtocolContext`, HTTP handler behavior, registration timing, and examples. Add protocols before `server.start()`; this is an explicit server extension boundary, not general request middleware.

Exact core types remain in [`ProtocolRegistration`](/en/api/@connectum/core/types/interfaces/ProtocolRegistration) and the generated [core API](/en/api/@connectum/core/). Package setup belongs to the [`@connectum/healthcheck`](/en/packages/healthcheck) and [`@connectum/reflection`](/en/packages/reflection) module hubs.
