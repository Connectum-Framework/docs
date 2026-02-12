---
title: Migration & Changelog
description: Migration guides and breaking changes for Connectum releases
---

# Migration & Changelog

## Current Version

**v1.0.0-beta.2** -- The current release of the Connectum framework.

## Breaking Changes from Alpha

If you are migrating from v0.2.0-alpha.x to v1.0.0-beta.x, the following breaking changes apply:

### API Changes

| Before (alpha) | After (beta) | ADR |
|----------------|--------------|-----|
| `Runner(options)` | `createServer(options)` | [ADR-023](/en/contributing/adr/023-uniform-registration-api) |
| `withReflection()` | `Reflection()` | [ADR-022](/en/contributing/adr/022-protocol-extraction) |
| `withHealthcheck()` | `Healthcheck({ httpEnabled: true })` | [ADR-022](/en/contributing/adr/022-protocol-extraction) |
| `server.health.update()` | `healthcheckManager.update()` | [ADR-022](/en/contributing/adr/022-protocol-extraction) |
| `builtinInterceptors: { ... }` | `interceptors: createDefaultInterceptors({ ... })` | [ADR-023](/en/contributing/adr/023-uniform-registration-api) |

### Package Changes

| Change | Details |
|--------|---------|
| New package: `@connectum/healthcheck` | Extracted from `@connectum/core` |
| New package: `@connectum/reflection` | Extracted from `@connectum/core` |
| New package: `@connectum/cli` | Proto sync via gRPC Server Reflection |
| Removed: `@connectum/utilities` | Merged into other packages |
| Total packages | 6 → 8 |

### Migration Example

**Before (alpha):**

```typescript
import { Runner } from '@connectum/core';

const server = Runner({
    services: [routes],
    port: 5000,
    builtinInterceptors: {
        errorHandler: true,
        logger: { level: 'debug' },
        tracing: true,
    },
    health: { enabled: true },
    reflection: true,
});

server.on('ready', () => {
    server.health.update(ServingStatus.SERVING);
});

await server.start();
```

**After (beta):**

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';
import { createDefaultInterceptors } from '@connectum/interceptors';

const server = createServer({
    services: [routes],
    port: 5000,
    protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
    interceptors: createDefaultInterceptors(),
    shutdown: { autoShutdown: true },
});

server.on('ready', () => {
    healthcheckManager.update(ServingStatus.SERVING);
});

await server.start();
```

### Interceptors: No Auto-Defaults

Starting from v1.0.0-beta.2, `@connectum/core` has **zero internal dependencies**. Omitting the `interceptors` option (or passing `[]`) means **no interceptors are applied**. To use the default resilience chain, explicitly pass `createDefaultInterceptors()`:

```typescript
import { createServer } from '@connectum/core';
import { createDefaultInterceptors } from '@connectum/interceptors';

const server = createServer({
  services: [routes],
  interceptors: createDefaultInterceptors(), // explicit!
});
```

## Changelog

For detailed changelog, see the [CHANGELOG.md](https://github.com/Connectum-Framework/connectum/blob/main/CHANGELOG.md) in the main repository.

## Architecture Decision Records

All significant architectural decisions are documented as ADRs:

- [ADR Index](/en/contributing/adr/) -- Complete list of 23 Architecture Decision Records
