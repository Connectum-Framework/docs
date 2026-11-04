[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / OtelFilter

# Type Alias: OtelFilter

> **OtelFilter** = (`context`) => `boolean`

Defined in: [types.ts:18](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L18)

Filter callback to skip specific RPC requests from instrumentation

A callback that throws never fails the call: the call is instrumented and the error is
reported once per interceptor to the OpenTelemetry diagnostics channel.

## Parameters

### context

RPC call context

#### method

`string`

#### service

`string`

#### stream

`boolean`

## Returns

`boolean`

`true` to instrument, `false` to skip
