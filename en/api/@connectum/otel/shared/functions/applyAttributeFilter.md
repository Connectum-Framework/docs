[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / applyAttributeFilter

# Function: applyAttributeFilter()

> **applyAttributeFilter**(`attrs`, `filter?`): `Attributes`

Defined in: [packages/otel/src/shared.ts:181](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/shared.ts#L181)

Applies an attribute filter to the given attributes.

## Parameters

### attrs

`Record`\<`string`, `string` \| `number`\>

Base attributes to filter

### filter?

[`OtelAttributeFilter`](../../type-aliases/OtelAttributeFilter.md)

Optional filter function

## Returns

`Attributes`

Filtered attributes
