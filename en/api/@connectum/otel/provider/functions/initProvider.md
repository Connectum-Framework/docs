[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / initProvider

# Function: initProvider()

> **initProvider**(`options?`): `void`

Defined in: [provider.ts:593](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L593)

Initialize the OpenTelemetry provider with explicit options.

Optional -- [getProvider](getProvider.md), [getMeter](../../meter/functions/getMeter.md), [getTracer](../../tracer/functions/getTracer.md),
and [getLogger](../../logger/functions/getLogger.md) auto-initialize with environment-based defaults.
Idempotent: subsequent calls are no-ops if provider is already active.
Call [shutdownProvider](shutdownProvider.md) first to re-initialize with new options.

## Parameters

### options?

[`ProviderOptions`](../interfaces/ProviderOptions.md)

Optional provider configuration overrides

## Returns

`void`

## Throws

TypeError when `options.settings` names a signal or an exporter that
does not exist. The check runs before anything is created, also when a provider
already exists and the options would otherwise be ignored.
