[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [defaults](../index.md) / DefaultInterceptorOptions

# Interface: DefaultInterceptorOptions

Defined in: [defaults.ts:42](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L42)

Configuration options for the default interceptor chain.

Except for fallback and validation, each interceptor can be:
- `false` to disable it entirely
- `true` to enable with default options
- An options object to enable with custom configuration

Fallback requires an options object with a handler; boolean values leave it
disabled. Validation accepts only a boolean and is enabled unless `false`.

Only structural interceptors (errorHandler, validation) are enabled by
default. Behavioral resilience interceptors (timeout, bulkhead,
circuitBreaker, retry) are opt-in: implicitly enabled behavior-altering
logic is hidden logic, and hidden logic caused a confirmed production
incident (a server-side circuit breaker tripping on expected business
errors). Enable each one explicitly where you need it.

## Properties

### bulkhead?

> `optional` **bulkhead?**: `boolean` \| [`BulkheadOptions`](../../interfaces/BulkheadOptions.md)

Defined in: [defaults.ts:64](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L64)

Bulkhead interceptor.
Limits concurrent requests to prevent resource exhaustion.
Opt-in: no hidden behavioral logic.

#### Default

```ts
false
```

***

### circuitBreaker?

> `optional` **circuitBreaker?**: `boolean` \| [`CircuitBreakerOptions`](../../interfaces/CircuitBreakerOptions.md)

Defined in: [defaults.ts:73](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L73)

Circuit breaker interceptor.
Prevents cascading failures by breaking circuit on consecutive errors.
Opt-in: no hidden behavioral logic. Intended primarily for outbound
client transports — see the README before enabling it server-side.

#### Default

```ts
false
```

***

### errorHandler?

> `optional` **errorHandler?**: `boolean` \| [`ErrorHandlerOptions`](../../interfaces/ErrorHandlerOptions.md)

Defined in: [defaults.ts:48](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L48)

Error handler interceptor (first in chain).
Transforms errors into ConnectError with proper codes.

#### Default

```ts
true
```

***

### fallback?

> `optional` **fallback?**: `boolean` \| [`FallbackOptions`](../../interfaces/FallbackOptions.md)\<`unknown`\>

Defined in: [defaults.ts:90](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L90)

Fallback interceptor.
Provides graceful degradation when service fails.
Disabled by default — requires a handler function.
Pass an options object with a handler to enable it; `true` leaves it disabled.

#### Default

```ts
false
```

***

### retry?

> `optional` **retry?**: `boolean` \| [`RetryOptions`](../../interfaces/RetryOptions.md)

Defined in: [defaults.ts:81](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L81)

Retry interceptor.
Retries transient failures with exponential backoff.
Opt-in: no hidden behavioral logic.

#### Default

```ts
false
```

***

### serializer?

> `optional` **serializer?**: `boolean` \| [`SerializerOptions`](../../interfaces/SerializerOptions.md)

Defined in: [defaults.ts:105](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L105)

Serializer interceptor (last in chain).
Auto JSON serialization for ConnectRPC responses.
Disabled by default — enable explicitly when JSON output is needed.

#### Default

```ts
false
```

***

### timeout?

> `optional` **timeout?**: `boolean` \| [`TimeoutOptions`](../../interfaces/TimeoutOptions.md)

Defined in: [defaults.ts:56](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L56)

Timeout interceptor.
Enforces request deadline before any processing.
Opt-in: no hidden behavioral logic.

#### Default

```ts
false
```

***

### validation?

> `optional` **validation?**: `boolean`

Defined in: [defaults.ts:97](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L97)

Validation interceptor.
Validates request messages using @connectrpc/validate.

#### Default

```ts
true
```
