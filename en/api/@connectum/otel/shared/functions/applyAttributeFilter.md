[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / applyAttributeFilter

# Function: applyAttributeFilter()

> **applyAttributeFilter**(`attrs`, `filter?`): `Attributes`

Defined in: [packages/otel/src/shared.ts:181](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/shared.ts#L181)

Applies an attribute filter to the given attributes.

## Parameters

### attrs

`Record`\<`string`, `string` \| `number`\>

Base attributes to filter

### filter?

[`OtelAttributeFilter`](../../@connectum/otel/type-aliases/OtelAttributeFilter.md)

Optional filter function

## Returns

`Attributes`

Filtered attributes
