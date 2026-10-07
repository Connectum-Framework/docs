[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / shutdownProvider

# Function: shutdownProvider()

> **shutdownProvider**(): `Promise`\<`void`\>

Defined in: [provider.ts:488](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L488)

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

## Returns

`Promise`\<`void`\>

## Throws

The failure of the one signal that could not stop, or an
`AggregateError` carrying the failures when several could not
