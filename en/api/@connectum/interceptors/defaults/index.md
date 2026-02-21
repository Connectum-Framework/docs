[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / defaults

# defaults

Default interceptor chain factory

Creates the production-ready interceptor chain with resilience patterns.
The interceptor order is fixed:
errorHandler → timeout → bulkhead → circuitBreaker → retry → fallback → validation → serializer.

## Interfaces

- [DefaultInterceptorOptions](interfaces/DefaultInterceptorOptions.md)

## Functions

- [createDefaultInterceptors](functions/createDefaultInterceptors.md)
