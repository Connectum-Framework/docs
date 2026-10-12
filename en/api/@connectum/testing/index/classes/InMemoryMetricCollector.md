[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / InMemoryMetricCollector

# Class: InMemoryMetricCollector

Defined in: [testing/src/otel-collectors.ts:193](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L193)

In-memory metric collector. Owns its own `MeterProvider` and periodic
reader. `flush()` performs a forced collect+export cycle synchronously
(via `forceFlush`) and returns the normalized data.

## Constructors

### Constructor

> **new InMemoryMetricCollector**(): `InMemoryMetricCollector`

Defined in: [testing/src/otel-collectors.ts:198](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L198)

#### Returns

`InMemoryMetricCollector`

## Properties

### exporter

> `readonly` **exporter**: `InMemoryMetricExporter`

Defined in: [testing/src/otel-collectors.ts:194](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L194)

***

### provider

> `readonly` **provider**: `MeterProvider`

Defined in: [testing/src/otel-collectors.ts:195](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L195)

***

### reader

> `readonly` **reader**: `PeriodicExportingMetricReader`

Defined in: [testing/src/otel-collectors.ts:196](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L196)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [testing/src/otel-collectors.ts:232](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L232)

#### Returns

`Promise`\<`void`\>

***

### flush()

> **flush**(): `Promise`\<[`NormalizedMetric`](../interfaces/NormalizedMetric.md)[]\>

Defined in: [testing/src/otel-collectors.ts:211](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L211)

#### Returns

`Promise`\<[`NormalizedMetric`](../interfaces/NormalizedMetric.md)[]\>

***

### reset()

> **reset**(): `void`

Defined in: [testing/src/otel-collectors.ts:228](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L228)

#### Returns

`void`
