[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / InMemorySpanCollector

# Class: InMemorySpanCollector

Defined in: [testing/src/otel-collectors.ts:175](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L175)

In-memory span collector. Owns its own `BasicTracerProvider` so that
different scenarios cannot cross-contaminate.

The provider is not registered globally. Callers that need
`trace.getTracer(...)` to resolve here should pass `collector.provider` to
`trace.setGlobalTracerProvider()` from `@opentelemetry/api`, and when done
call `trace.disable()` (which removes the global registration) before
[InMemorySpanCollector.dispose](#dispose).

Prefer `withTelemetry`, or the `telemetry` option of
`transportParityTest`, which perform the registration below in the right
order and undo it afterwards. By hand, to collect the spans of
`@connectum/otel` interceptors two more steps are needed, and without them a
scenario records nothing and still passes a parity comparison of two empty
results:

- Run with `OTEL_TRACES_EXPORTER=none` and `OTEL_METRICS_EXPORTER=none`.
  With the default exporters `@connectum/otel` records into providers of
  its own, never into the global one.
- Call `shutdownProvider()` from `@connectum/otel` before registering the
  collector, at the start of every scenario. `@connectum/otel` keeps the
  tracer it created for the provider registered when it first recorded
  something; only the shutdown drops it, so a later scenario's collector
  would stay empty.

## Example

```typescript
await shutdownProvider();
trace.disable();
trace.setGlobalTracerProvider(ctx.spans.provider);
// ...call the service...
const spans = ctx.spans.flush();
trace.disable();
```

## Constructors

### Constructor

> **new InMemorySpanCollector**(): `InMemorySpanCollector`

Defined in: [testing/src/otel-collectors.ts:179](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L179)

#### Returns

`InMemorySpanCollector`

## Properties

### exporter

> `readonly` **exporter**: `InMemorySpanExporter`

Defined in: [testing/src/otel-collectors.ts:176](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L176)

***

### provider

> `readonly` **provider**: `BasicTracerProvider`

Defined in: [testing/src/otel-collectors.ts:177](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L177)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [testing/src/otel-collectors.ts:209](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L209)

#### Returns

`Promise`\<`void`\>

***

### flush()

> **flush**(): [`NormalizedSpan`](../interfaces/NormalizedSpan.md)[]

Defined in: [testing/src/otel-collectors.ts:193](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L193)

Returns normalized finished spans collected so far.

Spans are sorted by `(name, kind, sorted-attributes)` so that scenarios
which emit multiple spans concurrently produce a deterministic order
for the parity structural diff.

#### Returns

[`NormalizedSpan`](../interfaces/NormalizedSpan.md)[]

***

### reset()

> **reset**(): `void`

Defined in: [testing/src/otel-collectors.ts:205](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L205)

Clear the internal buffer.

#### Returns

`void`
