[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / OtelFilter

# Type Alias: OtelFilter()

> **OtelFilter** = (`context`) => `boolean`

Defined in: [packages/otel/src/types.ts:15](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/otel/src/types.ts#L15)

Filter callback to skip specific RPC requests from instrumentation

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
