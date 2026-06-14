[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / defaults

# defaults

Default interceptor chain factory

Creates the interceptor chain in a fixed order:
errorHandler → timeout → bulkhead → circuitBreaker → retry → fallback → validation → serializer.
Only errorHandler and validation are enabled by default; resilience
interceptors (timeout, bulkhead, circuitBreaker, retry) are opt-in —
no hidden behavioral logic.

## Interfaces

- [DefaultInterceptorOptions](interfaces/DefaultInterceptorOptions.md)

## Functions

- [createDefaultInterceptors](functions/createDefaultInterceptors.md)
