[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / InMemorySpanCollector

# Class: InMemorySpanCollector

Defined in: [testing/src/otel-collectors.ts:147](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/testing/src/otel-collectors.ts#L147)

In-memory span collector. Owns its own `BasicTracerProvider` so that
different scenarios cannot cross-contaminate.

Callers wishing to register the provider globally (so that
`trace.getTracer(...)` resolves here) should call registerGlobal
— and pair it with [InMemorySpanCollector.dispose](#dispose) when done.

## Constructors

### Constructor

> **new InMemorySpanCollector**(): `InMemorySpanCollector`

Defined in: [testing/src/otel-collectors.ts:151](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/testing/src/otel-collectors.ts#L151)

#### Returns

`InMemorySpanCollector`

## Properties

### exporter

> `readonly` **exporter**: `InMemorySpanExporter`

Defined in: [testing/src/otel-collectors.ts:148](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/testing/src/otel-collectors.ts#L148)

***

### provider

> `readonly` **provider**: `BasicTracerProvider`

Defined in: [testing/src/otel-collectors.ts:149](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/testing/src/otel-collectors.ts#L149)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [testing/src/otel-collectors.ts:181](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/testing/src/otel-collectors.ts#L181)

#### Returns

`Promise`\<`void`\>

***

### flush()

> **flush**(): [`NormalizedSpan`](../interfaces/NormalizedSpan.md)[]

Defined in: [testing/src/otel-collectors.ts:165](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/testing/src/otel-collectors.ts#L165)

Returns normalized finished spans collected so far.

Spans are sorted by `(name, kind, sorted-attributes)` so that scenarios
which emit multiple spans concurrently produce a deterministic order
for the parity structural diff.

#### Returns

[`NormalizedSpan`](../interfaces/NormalizedSpan.md)[]

***

### reset()

> **reset**(): `void`

Defined in: [testing/src/otel-collectors.ts:177](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/testing/src/otel-collectors.ts#L177)

Clear the internal buffer.

#### Returns

`void`
