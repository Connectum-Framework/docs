---
title: Migration & Changelog
description: Migration guides and breaking changes for Connectum releases
---

# Migration & Changelog

This page covers breaking changes and migration steps between Connectum releases.

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
| Total packages | 6 → 7 |

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

Starting from v1.0.0-beta.x, `@connectum/core` has **zero internal dependencies**. Omitting the `interceptors` option (or passing `[]`) means **no interceptors are applied**. To use the default resilience chain, explicitly pass `createDefaultInterceptors()`:

```typescript
import { createServer } from '@connectum/core';
import { createDefaultInterceptors } from '@connectum/interceptors';

const server = createServer({
  services: [routes],
  interceptors: createDefaultInterceptors(), // explicit!
});
```

## Key Resolution Priority Change (`@connectum/auth`)

**Affected versions**: v1.0.0-beta.x onwards

The JWT auth interceptor (`createJwtAuthInterceptor`) changed the key resolution priority when multiple key sources are provided:

| | Before | After |
|---|--------|-------|
| **Priority** | `jwksUri` > `secret` > `publicKey` | `jwksUri` > `publicKey` > `secret` |

### Impact

This change only affects configurations that provide **both** `publicKey` and `secret` simultaneously. Previously the symmetric `secret` was used; now the asymmetric `publicKey` takes precedence.

- **No impact** if you use only one of `jwksUri`, `secret`, or `publicKey`
- **No impact** if you use `jwksUri` (highest priority, unchanged)

### Migration

If you rely on the previous behavior where `secret` wins over `publicKey`, remove the `publicKey` option:

```typescript
// Before: secret was used (publicKey was ignored)
const auth = createJwtAuthInterceptor({
  secret: process.env.JWT_SECRET,
  publicKey: myPublicKey, // was silently ignored
});

// After: remove publicKey if you want HMAC verification
const auth = createJwtAuthInterceptor({
  secret: process.env.JWT_SECRET,
});
```

### Rationale

Asymmetric keys (`publicKey`) are cryptographically stronger than symmetric secrets (`secret`). When both are provided, the more secure option should take precedence.

## Changelog

For detailed changelog, see the [CHANGELOG.md](https://github.com/Connectum-Framework/connectum/blob/main/CHANGELOG.md) in the main repository.

## Architecture Decision Records

All significant architectural decisions are documented as ADRs:

- [ADR Index](/en/contributing/adr/) -- Complete list of 23 Architecture Decision Records
