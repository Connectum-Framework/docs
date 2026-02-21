[Connectum API Reference](../../../../../index.md) / [@connectum/otel](../../../index.md) / [@connectum/otel](../index.md) / OtelFilter

# Type Alias: OtelFilter()

> **OtelFilter** = (`context`) => `boolean`

Defined in: [packages/otel/src/types.ts:15](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/types.ts#L15)

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
