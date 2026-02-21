[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [defaults](../index.md) / DefaultInterceptorOptions

# Interface: DefaultInterceptorOptions

Defined in: [defaults.ts:33](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/defaults.ts#L33)

Configuration options for the default interceptor chain.

Each interceptor can be:
- `false` to disable it entirely
- `true` to enable with default options
- An options object to enable with custom configuration

All interceptors are enabled by default except fallback
(which requires a handler function).

## Properties

### bulkhead?

> `optional` **bulkhead**: `boolean` \| [`BulkheadOptions`](../../interfaces/BulkheadOptions.md)

Defined in: [defaults.ts:53](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/defaults.ts#L53)

Bulkhead interceptor.
Limits concurrent requests to prevent resource exhaustion.

#### Default

```ts
true (10/10)
```

***

### circuitBreaker?

> `optional` **circuitBreaker**: `boolean` \| [`CircuitBreakerOptions`](../../interfaces/CircuitBreakerOptions.md)

Defined in: [defaults.ts:60](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/defaults.ts#L60)

Circuit breaker interceptor.
Prevents cascading failures by breaking circuit on consecutive errors.

#### Default

```ts
true (5 failures)
```

***

### errorHandler?

> `optional` **errorHandler**: `boolean` \| [`ErrorHandlerOptions`](../../interfaces/ErrorHandlerOptions.md)

Defined in: [defaults.ts:39](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/defaults.ts#L39)

Error handler interceptor (first in chain).
Transforms errors into ConnectError with proper codes.

#### Default

```ts
true
```

***

### fallback?

> `optional` **fallback**: `boolean` \| [`FallbackOptions`](../../interfaces/FallbackOptions.md)\<`unknown`\>

Defined in: [defaults.ts:75](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/defaults.ts#L75)

Fallback interceptor.
Provides graceful degradation when service fails.
Disabled by default — requires a handler function.

#### Default

```ts
false
```

***

### retry?

> `optional` **retry**: `boolean` \| [`RetryOptions`](../../interfaces/RetryOptions.md)

Defined in: [defaults.ts:67](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/defaults.ts#L67)

Retry interceptor.
Retries transient failures with exponential backoff.

#### Default

```ts
true (3 retries)
```

***

### serializer?

> `optional` **serializer**: `boolean` \| [`SerializerOptions`](../../interfaces/SerializerOptions.md)

Defined in: [defaults.ts:89](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/defaults.ts#L89)

Serializer interceptor (last in chain).
Auto JSON serialization for ConnectRPC responses.

#### Default

```ts
true
```

***

### timeout?

> `optional` **timeout**: `boolean` \| [`TimeoutOptions`](../../interfaces/TimeoutOptions.md)

Defined in: [defaults.ts:46](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/defaults.ts#L46)

Timeout interceptor.
Enforces request deadline before any processing.

#### Default

```ts
true (30s)
```

***

### validation?

> `optional` **validation**: `boolean`

Defined in: [defaults.ts:82](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/defaults.ts#L82)

Validation interceptor.
Validates request messages using @connectrpc/validate.

#### Default

```ts
true
```
