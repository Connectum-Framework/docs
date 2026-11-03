[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / applyAttributeFilter

# Function: applyAttributeFilter()

> **applyAttributeFilter**(`attrs`, `filter?`, `report?`): `Attributes`

Defined in: [shared.ts:435](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/shared.ts#L435)

Applies an attribute filter to the given attributes.

An attribute is kept only if the filter approves it, so a filter that throws for an
attribute drops that attribute (the failure is reported, the call is not affected).

## Parameters

### attrs

`Record`\<`string`, `string` \| `number`\>

Base attributes to filter

### filter?

[`OtelAttributeFilter`](../../type-aliases/OtelAttributeFilter.md)

Optional filter function

### report?

[`HookFailureReporter`](../type-aliases/HookFailureReporter.md) = `reportForDirectCaller`

Reporter for a throwing filter; the interceptors pass their own, a direct caller gets one report per process

## Returns

`Attributes`

Filtered attributes
