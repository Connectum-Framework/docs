# ADR-014: Per-Method Interceptor Routing (createMethodFilterInterceptor)

**Status:** Accepted - 2026-02-07

**Deciders:** Tech Lead, Platform Team

**Tags:** `interceptors`, `per-method`, `routing`, `filter`, `wildcard`, `moleculer-inspired`

**Supersedes:** Original ADR-014 (Per-Method Action Hooks) -- rejected after Codex Debater review due to introducing a second execution model alongside interceptors.

---

## Context

### Problem: no per-method customization

Connectum interceptors form a flat chain applied to **all** RPC methods uniformly. The current interceptor chain in `createServer()` (see [ADR-006](./006-resilience-pattern-implementation.md)):

```
Error Handler -> Validation -> Serializer -> Logger -> Tracing -> Redact -> [Custom Interceptors] -> Handler
```

**Limitation:**

If `checkAuth` should only apply to `UserService/GetUser` and `rateLimit` only to `PaymentService/*`, the only option is writing a custom interceptor with manual filtering:

```typescript
// Current approach: manual filtering inside the interceptor
const authInterceptor: Interceptor = (next) => async (req) => {
  if (req.method.name === "GetUser" && req.service.typeName === "UserService") {
    await checkAuth(req);
  }
  return next(req);
};
```

This leads to:
- **Boilerplate**: every custom interceptor contains if/else filtering logic
- **No standard API**: each developer implements filtering differently
- **Composition difficulty**: no declarative way to describe per-method behavior

### Rejected approach: Action Hooks

An approach with hooks (before/after/error) inspired by Moleculer was initially considered. **Rejected** after critical analysis:

1. **Two execution models**: interceptors + hooks create confusion ("where do I add auth check?")
2. **Increased core surface area**: hooks added new types (BeforeHook, AfterHook, ErrorHook, HookContext) to `@connectum/core`
3. **Error handling anti-pattern**: error hooks with chain interruption (`return true`) contradicted standard ConnectRPC error handling via `ConnectError`

**Codex Debater recommendation**: keep the single interceptor pattern, add a convenience helper for per-method routing.

### Current interceptors (12 total)

| Category | Interceptors |
|----------|-------------|
| **Core (builtin)** | errorHandler, logger, serializer, tracing, validation, redact |
| **Auth** | addToken (JWT) |
| **Resilience (opt-in)** | retry, circuit-breaker, timeout, bulkhead, fallback |

---

## Decision

**Implement `createMethodFilterInterceptor` in `@connectum/interceptors` -- a convenience helper for per-method interceptor routing within the single interceptor pattern.**

### API Design

```typescript
import { createMethodFilterInterceptor } from "@connectum/interceptors";

const perMethodInterceptor = createMethodFilterInterceptor({
  // Exact match: specific method
  "user.v1.UserService/GetUser": [checkAuth, enrichUser],

  // Service wildcard: all methods of a service
  "payment.v1.PaymentService/*": [validatePayment, auditLog],

  // Global wildcard: all methods
  "*": [logRequest],
});

const server = createServer({
  services: [routes],
  interceptors: [perMethodInterceptor],
});
```

### createMethodFilterInterceptor Signature

```typescript
import type { Interceptor } from "@connectrpc/connect";

/**
 * Method pattern -> array of interceptors mapping.
 *
 * Patterns:
 * - "*" -- matches all methods
 * - "package.Service/*" -- matches all methods of a service
 * - "package.Service/Method" -- matches exact method
 *
 * Key format: service.typeName + "/" + method.name (full protobuf path)
 */
type MethodFilterMap = Record<string, Interceptor[]>;

interface MethodFilterOptions {
  /**
   * Per-method interceptor routing map.
   */
  methods: MethodFilterMap;

  /**
   * Skip streaming calls for all interceptors in this filter.
   * @default false
   */
  skipStreaming?: boolean;
}

/**
 * Create a single interceptor that routes to per-method interceptors
 * based on wildcard pattern matching.
 *
 * Resolution order (all matching patterns execute):
 * 1. Global wildcard "*" (executed first)
 * 2. Service wildcard "Service/*" (executed second)
 * 3. Exact match "Service/Method" (executed last)
 *
 * Within each pattern, interceptors execute in array order.
 */
function createMethodFilterInterceptor(
  methods: MethodFilterMap
): Interceptor;

// Overload with options
function createMethodFilterInterceptor(
  options: MethodFilterOptions
): Interceptor;
```

### Execution Order

All matching patterns execute **sequentially** (from general to specific):

```
Request: user.v1.UserService/GetUser

1. "*": [logRequest]              -- global (always runs)
2. "user.v1.UserService/*": []    -- service-level (if defined)
3. "user.v1.UserService/GetUser": [checkAuth, enrichUser]  -- exact match

Total chain: logRequest -> checkAuth -> enrichUser -> next(req)
```

This follows the ConnectRPC interceptor chain model -- each interceptor calls `next(req)`, forming a nested chain.

### Usage Examples

```typescript
// === Example 1: Auth per service ===
createMethodFilterInterceptor({
  "*": [logRequest],
  "admin.v1.AdminService/*": [requireAdmin],
  "user.v1.UserService/DeleteUser": [requireAdmin, auditLog],
});

// === Example 2: Resilience per method ===
createMethodFilterInterceptor({
  // 5s timeout for fast operations
  "catalog.v1.CatalogService/GetProduct": [
    createTimeoutInterceptor({ duration: 5_000 }),
  ],
  // 30s timeout for heavy operations
  "report.v1.ReportService/*": [
    createTimeoutInterceptor({ duration: 30_000 }),
    createCircuitBreakerInterceptor({ threshold: 3 }),
  ],
});

// === Example 3: Combine with server interceptors ===
createServer({
  services: [routes],
  interceptors: [
    // Global interceptors (all methods)
    createDeadlineInterceptor({ defaultTimeout: 30_000 }),
    // Per-method interceptors
    createMethodFilterInterceptor({
      "payment.v1.PaymentService/*": [
        createCircuitBreakerInterceptor({ threshold: 5 }),
        createRetryInterceptor({ maxRetries: 3 }),
      ],
    }),
  ],
});
```

### Pattern Matching Implementation

```typescript
// Matching logic (simplified)
function matchesPattern(
  pattern: string,
  serviceName: string,
  methodName: string,
): boolean {
  if (pattern === "*") return true;
  if (pattern.endsWith("/*")) {
    const servicePattern = pattern.slice(0, -2);
    return serviceName === servicePattern;
  }
  return pattern === `${serviceName}/${methodName}`;
}

// Pre-compiled at creation time for performance
// No regex -- simple string comparison and endsWith check
```

### Performance

- **Pattern matching**: O(n) where n = number of patterns. Pre-compiled map lookup for exact matches, linear scan only for wildcards.
- **Optimization**: At `createMethodFilterInterceptor()` call time, patterns are split into 3 groups (global, service, exact). Exact matches use Map lookup O(1). Service wildcards use Map lookup O(1). Global always executes.
- **Overhead**: 1 Map lookup + 1 Map lookup per request. Negligible for real workloads.

---

## Consequences

### Positive

- **Single execution model**: Interceptors only. No "interceptor vs hook" confusion. ConnectRPC interceptor pattern is the only pattern for cross-cutting concerns.
- **Per-method routing without boilerplate**: Declarative configuration instead of if/else in every interceptor.
- **Composable**: createMethodFilterInterceptor returns a regular Interceptor. Multiple instances can be used and combined with other interceptors.
- **Package: @connectum/interceptors (Layer 1)**: Does not increase `@connectum/core` surface area. Follows [ADR-003](./003-package-decomposition.md).
- **Wildcards**: `*` for global, `Service/*` for service-level -- covers typical use cases.
- **Zero new concepts**: Uses existing ConnectRPC Interceptor types. No BeforeHook, AfterHook, HookContext, or other new types.

### Negative

- **Interceptor nesting**: Each pattern creates a nested interceptor chain. For 10+ patterns the call stack may become deep. **Mitigation**: >10 patterns is rare in production; performance benchmark in Phase 1.
- **No after/error specific handling**: Unlike hooks, an interceptor sees the entire lifecycle (before+after+error in one). Separate after/error handling requires a custom interceptor. **Mitigation**: this is the standard ConnectRPC pattern, not a limitation.
- **Limited pattern syntax**: Only 3 variants (*, Service/*, Service/Method). No regex, no multi-level wildcards. **Mitigation**: covers 95% of use cases; for complex routing use a custom interceptor.

---

## Alternatives Considered

### Alternative 1: Action Hooks (before/after/error) -- REJECTED

**Rating:** 4/10

**Description:** Hooks API in createServer() options -- a 3-level hook system inspired by Moleculer.

**Pros:** Declarative, per-method, separate before/after/error.
**Cons:** Second execution model, increases core surface area, error chain interruption anti-pattern.
**Why rejected:** Codex Debater analysis revealed a fundamental issue: two execution models (interceptors + hooks) create confusion. A single interceptor pattern is cleaner and simpler.

### Alternative 2: Filter function per interceptor

**Rating:** 5/10

```typescript
createTimeoutInterceptor({
  duration: 5000,
  filter: (req) => req.service.typeName === "PaymentService",
});
```

**Pros:** Simple implementation, single pattern.
**Cons:** Each interceptor duplicates filter logic, no centralized configuration, no wildcards.
**Why rejected:** Distributed filter logic instead of centralized routing. createMethodFilterInterceptor provides a single configuration point.

### Alternative 3: Decorator pattern (@Method)

**Rating:** 3/10

**Why rejected:** Node.js 25.2.0+ type stripping does not support decorators ([ADR-001](./001-native-typescript-migration.md)). ConnectRPC uses function-based handlers, not classes.

---

## Implementation Plan

### Phase 1: Core Implementation (v0.2.x)

**Package:** `@connectum/interceptors`

**New files:**
- `packages/interceptors/src/method-filter.ts` -- createMethodFilterInterceptor implementation
- `packages/interceptors/tests/unit/method-filter.test.ts` -- unit tests

**Modified files:**
- `packages/interceptors/src/index.ts` -- export createMethodFilterInterceptor
- `packages/interceptors/src/types.ts` -- MethodFilterMap, MethodFilterOptions types

**Tests:**
- Pattern matching: *, Service/*, Service/Method
- Execution order: global -> service -> exact
- Empty pattern array (no-op)
- Multiple matching patterns
- skipStreaming option
- Integration with existing interceptors

---

## References

1. [ADR-006: Resilience Pattern Implementation](./006-resilience-pattern-implementation.md) -- interceptor chain, resilience patterns
2. ADR-010: Framework vs Infrastructure (internal planning document) -- optional interceptors, boundary
3. [ADR-003: Package Decomposition](./003-package-decomposition.md) -- Layer 1: @connectum/interceptors
4. [ConnectRPC Interceptors](https://connectrpc.com/docs/node/interceptors/) -- interceptor model
5. [Moleculer Action Hooks](https://moleculer.services/docs/0.14/actions.html#Action-hooks) -- inspiration (rejected approach)

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-02-07 | Tech Lead | Initial ADR: Per-Method Action Hooks (rejected after review) |
| 2026-02-07 | Tech Lead | Rewrite: createMethodFilterInterceptor (single interceptor model). Status: Accepted |
