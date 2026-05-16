[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / InMemoryMetricCollector

# Class: InMemoryMetricCollector

Defined in: testing/src/otel-collectors.ts:141

In-memory metric collector. Owns its own `MeterProvider` and periodic
reader. `flush()` performs a forced collect+export cycle synchronously
(via `forceFlush`) and returns the normalized data.

## Constructors

### Constructor

> **new InMemoryMetricCollector**(): `InMemoryMetricCollector`

Defined in: testing/src/otel-collectors.ts:146

#### Returns

`InMemoryMetricCollector`

## Properties

### exporter

> `readonly` **exporter**: `InMemoryMetricExporter`

Defined in: testing/src/otel-collectors.ts:142

***

### provider

> `readonly` **provider**: `MeterProvider`

Defined in: testing/src/otel-collectors.ts:143

***

### reader

> `readonly` **reader**: `PeriodicExportingMetricReader`

Defined in: testing/src/otel-collectors.ts:144

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: testing/src/otel-collectors.ts:176

#### Returns

`Promise`\<`void`\>

***

### flush()

> **flush**(): `Promise`\<[`NormalizedMetric`](../interfaces/NormalizedMetric.md)[]\>

Defined in: testing/src/otel-collectors.ts:158

#### Returns

`Promise`\<[`NormalizedMetric`](../interfaces/NormalizedMetric.md)[]\>

***

### reset()

> **reset**(): `void`

Defined in: testing/src/otel-collectors.ts:172

#### Returns

`void`
