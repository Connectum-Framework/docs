[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / getProvider

# Function: getProvider()

> **getProvider**(): `OtelProvider`

Defined in: [packages/otel/src/provider.ts:275](https://github.com/Connectum-Framework/connectum/blob/9c808efa603eaacdf10ddef6780ea699f46a1f35/packages/otel/src/provider.ts#L275)

Get the current OpenTelemetry provider.

If not yet initialized, lazily creates a provider with default
(environment-based) options.

## Returns

`OtelProvider`

The active OtelProvider instance
