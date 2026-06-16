[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / InMemoryMetricCollector

# Class: InMemoryMetricCollector

Defined in: [testing/src/otel-collectors.ts:191](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/otel-collectors.ts#L191)

In-memory metric collector. Owns its own `MeterProvider` and periodic
reader. `flush()` performs a forced collect+export cycle synchronously
(via `forceFlush`) and returns the normalized data.

## Constructors

### Constructor

> **new InMemoryMetricCollector**(): `InMemoryMetricCollector`

Defined in: [testing/src/otel-collectors.ts:196](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/otel-collectors.ts#L196)

#### Returns

`InMemoryMetricCollector`

## Properties

### exporter

> `readonly` **exporter**: `InMemoryMetricExporter`

Defined in: [testing/src/otel-collectors.ts:192](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/otel-collectors.ts#L192)

***

### provider

> `readonly` **provider**: `MeterProvider`

Defined in: [testing/src/otel-collectors.ts:193](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/otel-collectors.ts#L193)

***

### reader

> `readonly` **reader**: `PeriodicExportingMetricReader`

Defined in: [testing/src/otel-collectors.ts:194](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/otel-collectors.ts#L194)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [testing/src/otel-collectors.ts:229](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/otel-collectors.ts#L229)

#### Returns

`Promise`\<`void`\>

***

### flush()

> **flush**(): `Promise`\<[`NormalizedMetric`](../interfaces/NormalizedMetric.md)[]\>

Defined in: [testing/src/otel-collectors.ts:208](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/otel-collectors.ts#L208)

#### Returns

`Promise`\<[`NormalizedMetric`](../interfaces/NormalizedMetric.md)[]\>

***

### reset()

> **reset**(): `void`

Defined in: [testing/src/otel-collectors.ts:225](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/otel-collectors.ts#L225)

#### Returns

`void`
