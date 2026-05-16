[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / InMemorySpanCollector

# Class: InMemorySpanCollector

Defined in: testing/src/otel-collectors.ts:110

In-memory span collector. Owns its own `BasicTracerProvider` so that
different scenarios cannot cross-contaminate.

Callers wishing to register the provider globally (so that
`trace.getTracer(...)` resolves here) should call registerGlobal
— and pair it with [InMemorySpanCollector.dispose](#dispose) when done.

## Constructors

### Constructor

> **new InMemorySpanCollector**(): `InMemorySpanCollector`

Defined in: testing/src/otel-collectors.ts:114

#### Returns

`InMemorySpanCollector`

## Properties

### exporter

> `readonly` **exporter**: `InMemorySpanExporter`

Defined in: testing/src/otel-collectors.ts:111

***

### provider

> `readonly` **provider**: `BasicTracerProvider`

Defined in: testing/src/otel-collectors.ts:112

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: testing/src/otel-collectors.ts:131

#### Returns

`Promise`\<`void`\>

***

### flush()

> **flush**(): [`NormalizedSpan`](../interfaces/NormalizedSpan.md)[]

Defined in: testing/src/otel-collectors.ts:122

Returns normalized finished spans collected so far.

#### Returns

[`NormalizedSpan`](../interfaces/NormalizedSpan.md)[]

***

### reset()

> **reset**(): `void`

Defined in: testing/src/otel-collectors.ts:127

Clear the internal buffer.

#### Returns

`void`
