---
title: "Custom Protocols: setup/register Split"
description: Move one-time work out of ProtocolRegistration.register into the new setup(context) method.
docType: migration
---

# Custom Protocols: `setup` / `register` Split

> Applies to 1.3.0.

**Who needs to act:**

- authors of their own `ProtocolRegistration` implementations (see
  [Creating a custom protocol](/en/guide/protocols/custom)) — follow [How to migrate](#how-to-migrate);
- applications whose `defineLazyService` factory relies on being called for every
  transport, or on HTTP and in-process calls getting separate instances — review those
  services against [Related fix: `defineLazyService`](#related-fix-definelazyservice).

Applications that use only the built-in `Healthcheck()` and `Reflection()` and whose lazy
services do not depend on per-transport instances need **no changes** — the upgrade only
fixes their behavior.

## Why it changed

A server builds more than one `ConnectRouter` from the same registration: one for the
HTTP adapter and one for each in-process transport — `server.localClient()` and the
catalog transport behind `ctx.call`. Until 1.3.0, `register(router, context)` ran again
for every one of them, so one-time work ran again too. For the built-in protocols this
meant:

- **Healthcheck** re-initialized its manager on the first in-process call, dropped the
  tracked application services and started tracking its own `grpc.health.v1.Health` as
  `UNKNOWN` — overall health fell to `NOT_SERVING` and readiness probes failed.
- **Reflection** rebuilt its descriptor set from the grown registry, so in-process
  clients saw a different listing than HTTP clients.

1.3.0 splits the contract so that one-time work has its own place.

## What changed

| | Before | 1.3.0 |
|---|---|---|
| One-time work | inside `register` | `setup(context)` — optional, **once per server**, right before the protocol's first `register`; called again only if that materialization failed |
| Route registration | `register(router, context)` | `register(router)` — **once per router**, routes only |
| `context.registry` | live array, grew between calls | frozen snapshot: application services plus the protocols listed before this one |
| `context.services` | — | new: the mounted services (frozen snapshot, same "listed before this one" view); use it for service names — `registry` files may declare services that are not mounted |

This is a compiling breaking change: a `register` that still declares a `context`
parameter no longer type-checks against `ProtocolRegistration`. In plain JavaScript, a
`register` that reads `context` throws a `TypeError` on `server.start()` or on the first
`server.localClient()` — the failure is immediate, not silent.

## How to migrate

Move everything that reads `context` or has side effects into `setup`, keep the result in
the closure, and leave only `router.service(...)` calls in `register`.

**Before**

```typescript
import type { ConnectRouter } from '@connectrpc/connect';
import type { ProtocolContext, ProtocolRegistration } from '@connectum/core';

function ServerInfo(): ProtocolRegistration {
  return {
    name: 'server-info',
    register(router: ConnectRouter, context: ProtocolContext): void {
      const services = context.registry.flatMap((file) => file.services.map((s) => s.typeName));
      router.service(InfoService, { getInfo: () => ({ services }) });
    },
  };
}
```

**After**

```typescript
import type { ConnectRouter } from '@connectrpc/connect';
import type { ProtocolContext, ProtocolRegistration } from '@connectum/core';

function ServerInfo(): ProtocolRegistration {
  let services: string[] = [];
  return {
    name: 'server-info',
    setup(context: ProtocolContext): void {
      services = context.services.map((s) => s.typeName);
    },
    register(router: ConnectRouter): void {
      router.service(InfoService, { getInfo: () => ({ services }) });
    },
  };
}
```

A protocol that never used `context` only drops the parameter:
`register(router, _context)` becomes `register(router)`.

Tests that call `setup` directly build the `ProtocolContext` themselves, and that object
now needs `services` next to `registry`. List the services your test mounts, in the order
the server would mount them:

```typescript
myProtocol.setup({
  registry: [GreeterService.file],
  services: [GreeterService],
});
```

## Related fix: `defineLazyService`

In the same release `defineLazyService` runs its `factory` **once per server** instead of
once per router. No code change is needed; if your factory previously relied on being
called for every transport (for example, counting instances), it is now called once and
the instance is shared by HTTP, `server.localClient()` and `ctx.call`.

## Checklist

- [ ] Every custom `ProtocolRegistration` has a single-parameter `register(router)`.
- [ ] Registry reads and side effects live in `setup(context)`.
- [ ] Tests that build a `ProtocolContext` by hand pass `services` as well as `registry`.
- [ ] `pnpm typecheck` (or your equivalent) passes.
- [ ] Health and reflection behave the same over HTTP and through `server.localClient()`.
