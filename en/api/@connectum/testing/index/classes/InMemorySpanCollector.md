[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / InMemorySpanCollector

# Class: InMemorySpanCollector

Defined in: [testing/src/otel-collectors.ts:149](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L149)

In-memory span collector. Owns its own `BasicTracerProvider` so that
different scenarios cannot cross-contaminate.

The provider is not registered globally. Callers that need
`trace.getTracer(...)` to resolve here should pass `collector.provider` to
`trace.setGlobalTracerProvider()` from `@opentelemetry/api`, and when done
call `trace.disable()` (which removes the global registration) before
[InMemorySpanCollector.dispose](#dispose).

## Constructors

### Constructor

> **new InMemorySpanCollector**(): `InMemorySpanCollector`

Defined in: [testing/src/otel-collectors.ts:153](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L153)

#### Returns

`InMemorySpanCollector`

## Properties

### exporter

> `readonly` **exporter**: `InMemorySpanExporter`

Defined in: [testing/src/otel-collectors.ts:150](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L150)

***

### provider

> `readonly` **provider**: `BasicTracerProvider`

Defined in: [testing/src/otel-collectors.ts:151](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L151)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [testing/src/otel-collectors.ts:183](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L183)

#### Returns

`Promise`\<`void`\>

***

### flush()

> **flush**(): [`NormalizedSpan`](../interfaces/NormalizedSpan.md)[]

Defined in: [testing/src/otel-collectors.ts:167](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L167)

Returns normalized finished spans collected so far.

Spans are sorted by `(name, kind, sorted-attributes)` so that scenarios
which emit multiple spans concurrently produce a deterministic order
for the parity structural diff.

#### Returns

[`NormalizedSpan`](../interfaces/NormalizedSpan.md)[]

***

### reset()

> **reset**(): `void`

Defined in: [testing/src/otel-collectors.ts:179](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L179)

Clear the internal buffer.

#### Returns

`void`
