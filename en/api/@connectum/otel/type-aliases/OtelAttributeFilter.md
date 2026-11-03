[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / OtelAttributeFilter

# Type Alias: OtelAttributeFilter

> **OtelAttributeFilter** = (`key`, `value`) => `boolean`

Defined in: [types.ts:31](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L31)

Filter callback to exclude specific attributes from spans/metrics

A callback that throws never fails the call: the attribute it was asked about is not
recorded (an attribute is kept only if the filter approves it) and the error is
reported once per interceptor to the OpenTelemetry diagnostics channel.

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
