[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / ShutdownProviderOptions

# Interface: ShutdownProviderOptions

Defined in: [provider.ts:82](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L82)

Options of [shutdownProvider](../functions/shutdownProvider.md).

## Properties

### timeout?

> `optional` **timeout?**: `number`

Defined in: [provider.ts:94](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L94)

Longest time in milliseconds the call waits for the exporters to deliver what they
hold. When it passes, the call rejects with an error named `TimeoutError`. The
provider is released either way, and the exporters keep trying in the background
until their own timeout (`OTEL_EXPORTER_OTLP_TIMEOUT`, 10 seconds by default) ends.
The OpenTelemetry API global registrations (tracer provider, context manager,
propagator, meter and logger provider) are released only when that stop ends, so a
provider created before then does not obtain them.
Must be above 0 and at most 2147483647 (the longest delay a Node.js timer keeps). Without it the call waits as long as the
exporters need.
