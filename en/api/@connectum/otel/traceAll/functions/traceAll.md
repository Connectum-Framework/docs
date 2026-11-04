[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [traceAll](../index.md) / traceAll

# Function: traceAll()

> **traceAll**\<`T`\>(`target`, `options?`): `T`

Defined in: [traceAll.ts:48](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/traceAll.ts#L48)

Wraps all methods of an object in OpenTelemetry spans using ES6 Proxy.

Creates a Proxy that intercepts method calls and wraps each in a span.
Method wrappers are created lazily (on first access, not at Proxy creation).
Does NOT mutate the original object or its prototype, with one exception: a method
that returns a thenable (`return this` on a thenable target, a cached query) has the
`then` of that object replaced until it settles, and put back after (see [traced](../../traced/index.md)).

Property reads pass through untouched: getters run with the original object as
`this`, so getters over `#private` fields and `Map.size` work. An own method that is
neither writable nor configurable (a method of a frozen object) cannot be replaced by
a wrapper in a proxy and is returned as it is, untraced. A span ends when a returned
promise or thenable settles or a returned generator is exhausted, throws or is closed;
how a thenable that is not read through `then` ends its span is described at
[traced](../../traced/index.md).

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
