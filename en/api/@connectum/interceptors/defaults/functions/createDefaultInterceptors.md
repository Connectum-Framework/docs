[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [defaults](../index.md) / createDefaultInterceptors

# Function: createDefaultInterceptors()

> **createDefaultInterceptors**(`options?`): `Interceptor`[]

Defined in: [defaults.ts:128](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/interceptors/src/defaults.ts#L128)

Creates the default interceptor chain with the specified configuration.

The interceptor order is fixed and intentional:
1. **errorHandler** - Catch-all error normalization (outermost, must be first)
2. **timeout** - Enforce deadline before any processing
3. **bulkhead** - Limit concurrency
4. **circuitBreaker** - Prevent cascading failures
5. **retry** - Retry transient failures (exponential backoff)
6. **fallback** - Graceful degradation (DISABLED by default)
7. **validation** - @connectrpc/validate (createValidateInterceptor)
8. **serializer** - JSON serialization (innermost)

## Parameters

### options?

[`DefaultInterceptorOptions`](../interfaces/DefaultInterceptorOptions.md) = `{}`

Configuration for each interceptor

## Returns

`Interceptor`[]

Array of configured interceptors in the correct order

## Example

```typescript
// All defaults (fallback disabled)
const interceptors = createDefaultInterceptors();

// Disable retry, custom timeout
const interceptors = createDefaultInterceptors({
  retry: false,
  timeout: { duration: 10000 },
});

// Enable fallback with handler
const interceptors = createDefaultInterceptors({
  fallback: { handler: () => ({ data: [] }) },
});

// No interceptors: omit `interceptors` option in createServer()
// or pass `interceptors: []`
```
