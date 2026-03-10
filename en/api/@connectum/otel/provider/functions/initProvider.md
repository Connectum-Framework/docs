[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / initProvider

# Function: initProvider()

> **initProvider**(`options?`): `void`

Defined in: [packages/otel/src/provider.ts:261](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/otel/src/provider.ts#L261)

Initialize the OpenTelemetry provider with explicit options.

Must be called before any telemetry is emitted if custom configuration
is needed. Throws if already initialized -- call [shutdownProvider](shutdownProvider.md)
first to re-initialize.

## Parameters

### options?

[`ProviderOptions`](../interfaces/ProviderOptions.md)

Optional provider configuration overrides

## Returns

`void`

## Throws

Error if provider is already initialized
