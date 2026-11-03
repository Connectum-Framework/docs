[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [defaults](../index.md) / createDefaultInterceptors

# Function: createDefaultInterceptors()

> **createDefaultInterceptors**(`options?`): `Interceptor`[]

Defined in: [defaults.ts:208](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L208)

Creates the default interceptor chain with the specified configuration.

The interceptor order is fixed and intentional:
1. **errorHandler** - Normalize rejections from downstream `next(req)` (outermost; enabled by default)
2. **timeout** - Enforce deadline before any processing (OPT-IN)
3. **bulkhead** - Limit concurrency (OPT-IN)
4. **circuitBreaker** - Prevent cascading failures (OPT-IN; wraps retry — an
   ultimate failure counts once, regardless of the number of retry attempts)
5. **retry** - Retry transient failures with exponential backoff (OPT-IN)
6. **validation** - @connectrpc/validate (enabled by default)
7. **serializer** - JSON serialization (innermost, OPT-IN)

Resilience interceptors (2-5) are opt-in by design: the recommended path
must not silently alter request behavior.

**fallback** (OPT-IN, requires a handler) is the one interceptor whose place
depends on the others. It stands directly outside `circuitBreaker` and `retry`,
and still inside `timeout` and `bulkhead`: the value is served only after the
retries are exhausted or the open breaker has refused the call. Inside them it
would turn the first failure into a success, and neither would act. Validation
moves out with it, to stand right outside the fallback, so that a rejected request
is never answered by the fallback value. With a fallback the chain is therefore
errorHandler → timeout → bulkhead → validation → fallback → circuitBreaker → retry →
serializer; without one it is the order above. When you build the chain by hand,
follow the same rule: fallback outside the breaker and retry, validation outside the
fallback.

## Parameters

### options?

[`DefaultInterceptorOptions`](../interfaces/DefaultInterceptorOptions.md) = `{}`

Configuration for each interceptor

## Returns

`Interceptor`[]

Array of configured interceptors in the correct order

## Throws

TypeError if a key holds a value its shape does not allow (see [DefaultInterceptorOptions](../interfaces/DefaultInterceptorOptions.md))

## Throws

RangeError if a numeric option inside an options object is out of range

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
  // A plain object with the fields of the method's response message, or a message made with create(ResponseSchema, ...)
  fallback: { handler: () => ({ items: [] }) },
});

// No interceptors: omit `interceptors` option in createServer()
// or pass `interceptors: []`
```
