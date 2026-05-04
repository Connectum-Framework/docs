[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / OtelFilter

# Type Alias: OtelFilter

> **OtelFilter** = (`context`) => `boolean`

Defined in: [packages/otel/src/types.ts:15](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/otel/src/types.ts#L15)

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
