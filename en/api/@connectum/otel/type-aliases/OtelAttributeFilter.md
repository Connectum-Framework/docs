[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / OtelAttributeFilter

# Type Alias: OtelAttributeFilter()

> **OtelAttributeFilter** = (`key`, `value`) => `boolean`

Defined in: [packages/otel/src/types.ts:24](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/otel/src/types.ts#L24)

Filter callback to exclude specific attributes from spans/metrics

## Parameters

### key

`string`

Attribute key

### value

Attribute value

`string` | `number` | `boolean`

## Returns

`boolean`

`true` to include, `false` to exclude
