[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / shutdownProvider

# Function: shutdownProvider()

> **shutdownProvider**(`options?`): `Promise`\<`void`\>

Defined in: [provider.ts:655](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L655)

Gracefully shutdown the provider and release resources.

After shutdown, subsequent calls to [getProvider](getProvider.md) will create
a fresh provider. If no provider exists, this is a no-op.

The provider is released whether stopping succeeds or fails: when an
exporter cannot deliver its last batch (for example an unreachable
collector) the returned promise rejects, yet the next [getProvider](getProvider.md)
starts from a clean state and a repeated call is a no-op. Every signal is
stopped even if another one fails, and the OpenTelemetry API global
registrations this provider took are released; a registration that belonged
to other code is left alone. Interceptors created earlier keep working: they
record into whichever provider is current.

A call made while another call is still stopping a provider waits for that stop
too and settles with the same outcome, so two independent shutdown hooks cannot
race ahead of the flush. Once the stop has settled, a further call is a no-op.

The wait is bounded by the exporters (`OTEL_EXPORTER_OTLP_TIMEOUT`, 10 seconds
by default, per export). Pass `timeout` to bound it to what the surrounding shutdown
allows; see [ShutdownProviderOptions.timeout](../interfaces/ShutdownProviderOptions.md#timeout).

## Parameters

### options?

[`ShutdownProviderOptions`](../interfaces/ShutdownProviderOptions.md)

Optional deadline for this call

## Returns

`Promise`\<`void`\>

## Throws

The failure of the one signal that could not stop, or an
`AggregateError` carrying the failures when several could not

## Throws

An error named `TimeoutError` when `options.timeout` passed first

## Throws

TypeError when `options.timeout` is not a number above 0 and at most 2147483647
