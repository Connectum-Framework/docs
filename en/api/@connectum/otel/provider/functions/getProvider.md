[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / getProvider

# Function: getProvider()

> **getProvider**(): `OtelProvider`

Defined in: [packages/otel/src/provider.ts:276](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/provider.ts#L276)

Get the current OpenTelemetry provider.

If not yet initialized, lazily creates a provider with default
(environment-based) options.

## Returns

`OtelProvider`

The active OtelProvider instance
