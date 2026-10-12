[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / getProvider

# Function: getProvider()

> **getProvider**(): [`OtelProvider`](../interfaces/OtelProvider.md)

Defined in: [provider.ts:497](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L497)

Get the current OpenTelemetry provider.

If not yet initialized, lazily creates a provider with default
(environment-based) options.

## Returns

[`OtelProvider`](../interfaces/OtelProvider.md)

The active OtelProvider instance
