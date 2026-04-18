[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / initProvider

# Function: initProvider()

> **initProvider**(`options?`): `void`

Defined in: [packages/otel/src/provider.ts:261](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/otel/src/provider.ts#L261)

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
