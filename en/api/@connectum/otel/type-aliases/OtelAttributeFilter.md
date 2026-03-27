[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / OtelAttributeFilter

# Type Alias: OtelAttributeFilter()

> **OtelAttributeFilter** = (`key`, `value`) => `boolean`

Defined in: [packages/otel/src/types.ts:24](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/otel/src/types.ts#L24)

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
