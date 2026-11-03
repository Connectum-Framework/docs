[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / InMemoryMetricCollector

# Class: InMemoryMetricCollector

Defined in: [testing/src/otel-collectors.ts:227](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L227)

In-memory metric collector. Owns its own `MeterProvider` and periodic
reader. `flush()` performs a forced collect+export cycle synchronously
(via `forceFlush`) and returns the normalized data.

Register `collector.provider` with `metrics.setGlobalMeterProvider()` and
call `metrics.disable()` when done, exactly as for
[InMemorySpanCollector](InMemorySpanCollector.md) (or let `withTelemetry` do it). The same two requirements apply to collecting
the metrics of `@connectum/otel` interceptors: run with
`OTEL_METRICS_EXPORTER=none`, and call `shutdownProvider()` from
`@connectum/otel` at the start of every scenario, otherwise the scenario
records nothing.

## Constructors

### Constructor

> **new InMemoryMetricCollector**(): `InMemoryMetricCollector`

Defined in: [testing/src/otel-collectors.ts:233](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L233)

#### Returns

`InMemoryMetricCollector`

## Properties

### exporter

> `readonly` **exporter**: `InMemoryMetricExporter`

Defined in: [testing/src/otel-collectors.ts:228](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L228)

***

### provider

> `readonly` **provider**: `MeterProvider`

Defined in: [testing/src/otel-collectors.ts:229](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L229)

***

### reader

> `readonly` **reader**: `PeriodicExportingMetricReader`

Defined in: [testing/src/otel-collectors.ts:230](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L230)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [testing/src/otel-collectors.ts:283](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L283)

Shut the provider down. Calling it again is a no-op.

#### Returns

`Promise`\<`void`\>

***

### flush()

> **flush**(): `Promise`\<[`NormalizedMetric`](../interfaces/NormalizedMetric.md)[]\>

Defined in: [testing/src/otel-collectors.ts:256](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L256)

Force a collect+export cycle and return what was recorded since the
previous `flush()` (or since the collector was created or `reset()`),
normalized. The exporter's buffer is emptied by the read, so a flush with
nothing recorded in between returns `[]` and a lookup by name after a
later flush sees the current value, never an earlier export of the same
metric.

#### Returns

`Promise`\<[`NormalizedMetric`](../interfaces/NormalizedMetric.md)[]\>

#### Throws

Error when called after [InMemoryMetricCollector.dispose](#dispose)

***

### reset()

> **reset**(): `void`

Defined in: [testing/src/otel-collectors.ts:278](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/otel-collectors.ts#L278)

Forget what was exported and not yet returned by `flush()`.

#### Returns

`void`
