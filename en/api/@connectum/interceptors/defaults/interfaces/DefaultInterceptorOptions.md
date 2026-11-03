[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [defaults](../index.md) / DefaultInterceptorOptions

# Interface: DefaultInterceptorOptions

Defined in: [defaults.ts:56](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L56)

Configuration options for the default interceptor chain.

Except for fallback and validation, each interceptor can be:
- `false` to disable it entirely
- `true` to enable with default options
- An options object to enable with custom configuration

Fallback requires an options object with a handler: `false` (or omitting it)
leaves it disabled and `true` is refused, because there is no default handler.
Validation accepts only a boolean and is enabled unless `false`.

Any other value for a key (`null`, a number, a string, an array, a function) is
refused with a `TypeError` naming the key: a value that is not understood must
not silently disable an interceptor. A key that is not listed here, such as the
mistyped `timout`, is refused the same way, with the known keys in the message;
the logger and the method filter are not part of this chain, so create them
with their own factories. An argument that is not an object (`null`, for
example) is refused too. The numeric options inside an options
object are validated by their factories; see each options type for its range.

Only structural interceptors (errorHandler, validation) are enabled by
default. Behavioral resilience interceptors (timeout, bulkhead,
circuitBreaker, retry) are opt-in: implicitly enabled behavior-altering
logic is hidden logic, and hidden logic caused a confirmed production
incident (a server-side circuit breaker tripping on expected business
errors). Enable each one explicitly where you need it.

## Properties

### bulkhead?

> `optional` **bulkhead?**: `boolean` \| [`BulkheadOptions`](../../interfaces/BulkheadOptions.md)

Defined in: [defaults.ts:78](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L78)

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

Defined in: [defaults.ts:87](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L87)

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

Defined in: [defaults.ts:62](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L62)

Error handler interceptor (first in chain).
Transforms errors into ConnectError with proper codes.

#### Default

```ts
true
```

***

### fallback?

> `optional` **fallback?**: `false` \| [`FallbackOptions`](../../interfaces/FallbackOptions.md)\<`unknown`\>

Defined in: [defaults.ts:108](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L108)

Fallback interceptor.
Provides graceful degradation when service fails.
Stands outside `circuitBreaker` and `retry`, so the value is served after
the retries are exhausted or the open breaker has refused the call.
Disabled by default — requires a handler function.
Pass an options object with a handler to enable it. `true` is refused
with a `TypeError`: a fallback without an application-specific handler
would silently do nothing.

#### Default

```ts
false
```

***

### retry?

> `optional` **retry?**: `boolean` \| [`RetryOptions`](../../interfaces/RetryOptions.md)

Defined in: [defaults.ts:95](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L95)

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

Defined in: [defaults.ts:123](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L123)

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

Defined in: [defaults.ts:70](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L70)

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

Defined in: [defaults.ts:115](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/defaults.ts#L115)

Validation interceptor.
Validates request messages using @connectrpc/validate.

#### Default

```ts
true
```
