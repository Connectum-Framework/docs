[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / applyAttributeFilter

# Function: applyAttributeFilter()

> **applyAttributeFilter**(`attrs`, `filter?`): `Attributes`

Defined in: [packages/otel/src/shared.ts:181](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/otel/src/shared.ts#L181)

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
