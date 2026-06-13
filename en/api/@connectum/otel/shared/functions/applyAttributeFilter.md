[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / applyAttributeFilter

# Function: applyAttributeFilter()

> **applyAttributeFilter**(`attrs`, `filter?`): `Attributes`

Defined in: [packages/otel/src/shared.ts:198](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/otel/src/shared.ts#L198)

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
