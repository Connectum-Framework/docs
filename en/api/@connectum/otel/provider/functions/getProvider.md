[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / getProvider

# Function: getProvider()

> **getProvider**(): `OtelProvider`

Defined in: [packages/otel/src/provider.ts:371](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/otel/src/provider.ts#L371)

Get the current OpenTelemetry provider.

If not yet initialized, lazily creates a provider with default
(environment-based) options.

## Returns

`OtelProvider`

The active OtelProvider instance
