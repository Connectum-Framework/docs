[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / OtelFilter

# Type Alias: OtelFilter()

> **OtelFilter** = (`context`) => `boolean`

Defined in: [packages/otel/src/types.ts:15](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/otel/src/types.ts#L15)

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
