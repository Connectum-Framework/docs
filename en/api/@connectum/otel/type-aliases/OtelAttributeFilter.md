[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / OtelAttributeFilter

# Type Alias: OtelAttributeFilter

> **OtelAttributeFilter** = (`key`, `value`) => `boolean`

Defined in: [packages/otel/src/types.ts:24](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/otel/src/types.ts#L24)

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
