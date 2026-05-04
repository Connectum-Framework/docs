[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / OtelAttributeFilter

# Type Alias: OtelAttributeFilter

> **OtelAttributeFilter** = (`key`, `value`) => `boolean`

Defined in: [packages/otel/src/types.ts:24](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/otel/src/types.ts#L24)

Filter callback to exclude specific attributes from spans/metrics

## Parameters

### key

`string`

Attribute key

### value

`string` \| `number` \| `boolean`

Attribute value

## Returns

`boolean`

`true` to include, `false` to exclude
