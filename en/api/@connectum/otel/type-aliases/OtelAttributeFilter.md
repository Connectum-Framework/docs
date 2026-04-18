[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / OtelAttributeFilter

# Type Alias: OtelAttributeFilter

> **OtelAttributeFilter** = (`key`, `value`) => `boolean`

Defined in: [packages/otel/src/types.ts:24](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/otel/src/types.ts#L24)

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
