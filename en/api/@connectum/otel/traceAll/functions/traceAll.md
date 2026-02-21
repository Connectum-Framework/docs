[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [traceAll](../index.md) / traceAll

# Function: traceAll()

> **traceAll**\<`T`\>(`target`, `options?`): `T`

Defined in: [packages/otel/src/traceAll.ts:36](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/traceAll.ts#L36)

Wraps all methods of an object in OpenTelemetry spans using ES6 Proxy.

Creates a Proxy that intercepts method calls and wraps each in a span.
Method wrappers are created lazily (on first access, not at Proxy creation).
Does NOT mutate the original object or its prototype.

## Type Parameters

### T

`T` *extends* `object`

## Parameters

### target

`T`

The object whose methods to trace

### options?

[`TraceAllOptions`](../../interfaces/TraceAllOptions.md)

Tracing options

## Returns

`T`

A Proxy with traced methods

## Example

```typescript
const service = traceAll(new UserService(), {
    prefix: "UserService",
    exclude: ["internalHelper"],
});
```
