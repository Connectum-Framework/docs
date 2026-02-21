[Connectum API Reference](../../../../../index.md) / [@connectum/otel](../../../index.md) / [@connectum/otel](../index.md) / Meter

# Interface: Meter

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.0/node\_modules/@opentelemetry/api/build/src/metrics/Meter.d.ts:18

An interface to allow the recording metrics.

Metrics are used for recording pre-defined aggregation (`Counter`),
or raw values (`Histogram`) in which the aggregation and attributes
for the exported metric are deferred.

## Methods

### addBatchObservableCallback()

> **addBatchObservableCallback**\<`AttributesTypes`\>(`callback`, `observables`): `void`

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.0/node\_modules/@opentelemetry/api/build/src/metrics/Meter.d.ts:98

Sets up a function that will be called whenever a metric collection is
initiated.

If the function is already in the list of callbacks for this Observable,
the function is not added a second time.

Only the associated observables can be observed in the callback.
Measurements of observables that are not associated observed in the
callback are dropped.

#### Type Parameters

##### AttributesTypes

`AttributesTypes` *extends* `Attributes` = `Attributes`

#### Parameters

##### callback

`BatchObservableCallback`\<`AttributesTypes`\>

the batch observable callback

##### observables

`Observable`\<`AttributesTypes`\>[]

the observables associated with this batch observable callback

#### Returns

`void`

***

### createCounter()

> **createCounter**\<`AttributesTypes`\>(`name`, `options?`): `Counter`\<`AttributesTypes`\>

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.0/node\_modules/@opentelemetry/api/build/src/metrics/Meter.d.ts:38

Creates a new `Counter` metric. Generally, this kind of metric when the
value is a quantity, the sum is of primary interest, and the event count
and value distribution are not of primary interest.

#### Type Parameters

##### AttributesTypes

`AttributesTypes` *extends* `Attributes` = `Attributes`

#### Parameters

##### name

`string`

the name of the metric.

##### options?

`MetricOptions`

the metric options.

#### Returns

`Counter`\<`AttributesTypes`\>

***

### createGauge()

> **createGauge**\<`AttributesTypes`\>(`name`, `options?`): `Gauge`\<`AttributesTypes`\>

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.0/node\_modules/@opentelemetry/api/build/src/metrics/Meter.d.ts:24

Creates and returns a new `Gauge`.

#### Type Parameters

##### AttributesTypes

`AttributesTypes` *extends* `Attributes` = `Attributes`

#### Parameters

##### name

`string`

the name of the metric.

##### options?

`MetricOptions`

the metric options.

#### Returns

`Gauge`\<`AttributesTypes`\>

***

### createHistogram()

> **createHistogram**\<`AttributesTypes`\>(`name`, `options?`): `Histogram`\<`AttributesTypes`\>

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.0/node\_modules/@opentelemetry/api/build/src/metrics/Meter.d.ts:30

Creates and returns a new `Histogram`.

#### Type Parameters

##### AttributesTypes

`AttributesTypes` *extends* `Attributes` = `Attributes`

#### Parameters

##### name

`string`

the name of the metric.

##### options?

`MetricOptions`

the metric options.

#### Returns

`Histogram`\<`AttributesTypes`\>

***

### createObservableCounter()

> **createObservableCounter**\<`AttributesTypes`\>(`name`, `options?`): `ObservableCounter`\<`AttributesTypes`\>

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.0/node\_modules/@opentelemetry/api/build/src/metrics/Meter.d.ts:74

Creates a new `ObservableCounter` metric.

The callback SHOULD be safe to be invoked concurrently.

#### Type Parameters

##### AttributesTypes

`AttributesTypes` *extends* `Attributes` = `Attributes`

#### Parameters

##### name

`string`

the name of the metric.

##### options?

`MetricOptions`

the metric options.

#### Returns

`ObservableCounter`\<`AttributesTypes`\>

***

### createObservableGauge()

> **createObservableGauge**\<`AttributesTypes`\>(`name`, `options?`): `ObservableGauge`\<`AttributesTypes`\>

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.0/node\_modules/@opentelemetry/api/build/src/metrics/Meter.d.ts:65

Creates a new `ObservableGauge` metric.

The callback SHOULD be safe to be invoked concurrently.

#### Type Parameters

##### AttributesTypes

`AttributesTypes` *extends* `Attributes` = `Attributes`

#### Parameters

##### name

`string`

the name of the metric.

##### options?

`MetricOptions`

the metric options.

#### Returns

`ObservableGauge`\<`AttributesTypes`\>

***

### createObservableUpDownCounter()

> **createObservableUpDownCounter**\<`AttributesTypes`\>(`name`, `options?`): `ObservableUpDownCounter`\<`AttributesTypes`\>

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.0/node\_modules/@opentelemetry/api/build/src/metrics/Meter.d.ts:83

Creates a new `ObservableUpDownCounter` metric.

The callback SHOULD be safe to be invoked concurrently.

#### Type Parameters

##### AttributesTypes

`AttributesTypes` *extends* `Attributes` = `Attributes`

#### Parameters

##### name

`string`

the name of the metric.

##### options?

`MetricOptions`

the metric options.

#### Returns

`ObservableUpDownCounter`\<`AttributesTypes`\>

***

### createUpDownCounter()

> **createUpDownCounter**\<`AttributesTypes`\>(`name`, `options?`): `UpDownCounter`\<`AttributesTypes`\>

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.0/node\_modules/@opentelemetry/api/build/src/metrics/Meter.d.ts:56

Creates a new `UpDownCounter` metric. UpDownCounter is a synchronous
instrument and very similar to Counter except that Add(increment)
supports negative increments. It is generally useful for capturing changes
in an amount of resources used, or any quantity that rises and falls
during a request.
Example uses for UpDownCounter:
<ol>
  <li> count the number of active requests. </li>
  <li> count memory in use by instrumenting new and delete. </li>
  <li> count queue size by instrumenting enqueue and dequeue. </li>
  <li> count semaphore up and down operations. </li>
</ol>

#### Type Parameters

##### AttributesTypes

`AttributesTypes` *extends* `Attributes` = `Attributes`

#### Parameters

##### name

`string`

the name of the metric.

##### options?

`MetricOptions`

the metric options.

#### Returns

`UpDownCounter`\<`AttributesTypes`\>

***

### removeBatchObservableCallback()

> **removeBatchObservableCallback**\<`AttributesTypes`\>(`callback`, `observables`): `void`

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.0/node\_modules/@opentelemetry/api/build/src/metrics/Meter.d.ts:108

Removes a callback previously registered with [Meter.addBatchObservableCallback](#addbatchobservablecallback).

The callback to be removed is identified using a combination of the callback itself,
and the set of the observables associated with it.

#### Type Parameters

##### AttributesTypes

`AttributesTypes` *extends* `Attributes` = `Attributes`

#### Parameters

##### callback

`BatchObservableCallback`\<`AttributesTypes`\>

the batch observable callback

##### observables

`Observable`\<`AttributesTypes`\>[]

the observables associated with this batch observable callback

#### Returns

`void`
