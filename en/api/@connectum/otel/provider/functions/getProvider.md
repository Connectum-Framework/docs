[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / getProvider

# Function: getProvider()

> **getProvider**(): `OtelProvider`

Defined in: [packages/otel/src/provider.ts:276](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/provider.ts#L276)

Get the current OpenTelemetry provider.

If not yet initialized, lazily creates a provider with default
(environment-based) options.

## Returns

`OtelProvider`

The active OtelProvider instance
