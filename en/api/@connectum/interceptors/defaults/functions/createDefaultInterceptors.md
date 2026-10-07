[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [defaults](../index.md) / createDefaultInterceptors

# Function: createDefaultInterceptors()

> **createDefaultInterceptors**(`options?`): `Interceptor`[]

Defined in: [defaults.ts:162](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L162)

Creates the default interceptor chain with the specified configuration.

The interceptor order is fixed and intentional:
1. **errorHandler** - Normalize rejections from downstream `next(req)` (outermost; enabled by default)
2. **timeout** - Enforce deadline before any processing (OPT-IN)
3. **bulkhead** - Limit concurrency (OPT-IN)
4. **circuitBreaker** - Prevent cascading failures (OPT-IN; wraps retry — an
   ultimate failure counts once, regardless of the number of retry attempts)
5. **retry** - Retry transient failures with exponential backoff (OPT-IN)
6. **fallback** - Graceful degradation (OPT-IN, requires handler)
7. **validation** - @connectrpc/validate (enabled by default)
8. **serializer** - JSON serialization (innermost, OPT-IN)

Resilience interceptors (2-5) are opt-in by design: the recommended path
must not silently alter request behavior.

## Parameters

### options?

[`DefaultInterceptorOptions`](../interfaces/DefaultInterceptorOptions.md) = `{}`

Configuration for each interceptor

## Returns

`Interceptor`[]

Array of configured interceptors in the correct order

## Example

```typescript
import { createDefaultInterceptors } from '@connectum/interceptors';

// Defaults: errorHandler + validation only
const defaults = createDefaultInterceptors();

// Explicitly enable resilience where needed
const withResilience = createDefaultInterceptors({
  timeout: { duration: 10000 },
  bulkhead: true,
  retry: { maxRetries: 3 },
});

// Enable fallback with handler
const withFallback = createDefaultInterceptors({
  fallback: { handler: () => ({ data: [] }) },
});

// No interceptors: omit `interceptors` option in createServer()
// or pass `interceptors: []`
```
