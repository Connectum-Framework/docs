[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / OtelFilter

# Type Alias: OtelFilter

> **OtelFilter** = (`context`) => `boolean`

Defined in: [packages/otel/src/types.ts:15](https://github.com/Connectum-Framework/connectum/blob/9c808efa603eaacdf10ddef6780ea699f46a1f35/packages/otel/src/types.ts#L15)

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
