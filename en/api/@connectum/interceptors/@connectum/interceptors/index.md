[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / @connectum/interceptors

# @connectum/interceptors

@connectum/interceptors

Production-ready ConnectRPC interceptors with resilience patterns.

Default chain (8 interceptors):
errorHandler → timeout → bulkhead → circuitBreaker → retry → fallback → validation → serializer

## Interfaces

- [BulkheadOptions](interfaces/BulkheadOptions.md)
- [CircuitBreakerOptions](interfaces/CircuitBreakerOptions.md)
- [ErrorHandlerOptions](interfaces/ErrorHandlerOptions.md)
- [FallbackOptions](interfaces/FallbackOptions.md)
- [LoggerOptions](interfaces/LoggerOptions.md)
- [RetryOptions](interfaces/RetryOptions.md)
- [SerializerOptions](interfaces/SerializerOptions.md)
- [TimeoutOptions](interfaces/TimeoutOptions.md)

## Type Aliases

- [InterceptorFactory](type-aliases/InterceptorFactory.md)
- [MethodFilterMap](type-aliases/MethodFilterMap.md)

## References

### createBulkheadInterceptor

Re-exports [createBulkheadInterceptor](../../bulkhead/functions/createBulkheadInterceptor.md)

***

### createCircuitBreakerInterceptor

Re-exports [createCircuitBreakerInterceptor](../../circuit-breaker/functions/createCircuitBreakerInterceptor.md)

***

### createDefaultInterceptors

Re-exports [createDefaultInterceptors](../../defaults/functions/createDefaultInterceptors.md)

***

### createErrorHandlerInterceptor

Re-exports [createErrorHandlerInterceptor](../../errorHandler/functions/createErrorHandlerInterceptor.md)

***

### createFallbackInterceptor

Re-exports [createFallbackInterceptor](../../fallback/functions/createFallbackInterceptor.md)

***

### createLoggerInterceptor

Re-exports [createLoggerInterceptor](../../logger/functions/createLoggerInterceptor.md)

***

### createMethodFilterInterceptor

Re-exports [createMethodFilterInterceptor](../../method-filter/functions/createMethodFilterInterceptor.md)

***

### createRetryInterceptor

Re-exports [createRetryInterceptor](../../retry/functions/createRetryInterceptor.md)

***

### createSerializerInterceptor

Re-exports [createSerializerInterceptor](../../serializer/functions/createSerializerInterceptor.md)

***

### createTimeoutInterceptor

Re-exports [createTimeoutInterceptor](../../timeout/functions/createTimeoutInterceptor.md)

***

### DefaultInterceptorOptions

Re-exports [DefaultInterceptorOptions](../../defaults/interfaces/DefaultInterceptorOptions.md)
