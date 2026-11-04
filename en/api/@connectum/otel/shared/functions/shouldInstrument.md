[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / shouldInstrument

# Function: shouldInstrument()

> **shouldInstrument**(`filter`, `call`, `report`): `boolean`

Defined in: [shared.ts:414](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/shared.ts#L414)

Asks the `filter` option whether a call is to be instrumented. A filter that throws
counts as "instrument": the failure is reported, the call is not affected, and
telemetry is not lost silently.

## Parameters

### filter

[`OtelFilter`](../../type-aliases/OtelFilter.md) \| `undefined`

The user's filter, if any

### call

The call the filter is asked about

#### method

`string`

#### service

`string`

#### stream

`boolean`

### report

[`HookFailureReporter`](../type-aliases/HookFailureReporter.md)

Reporter for a throwing filter

## Returns

`boolean`

Whether to instrument the call
