[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / OtelProvider

# Interface: OtelProvider

Defined in: [provider.ts:141](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L141)

The process-wide OpenTelemetry provider returned by [getProvider](../functions/getProvider.md).

Manages OTLP exporters for traces, metrics, and logs.
Supports console, OTLP/HTTP, OTLP/gRPC exporters, and no-op mode
based on environment configuration or explicit options.

Only an interface is exported: the package keeps exactly one instance per
process, created by [initProvider](../functions/initProvider.md) or lazily by [getProvider](../functions/getProvider.md),
so there is deliberately no public constructor. The type lets callers name
the value `getProvider()` returns (to store it or pass it on).

## Properties

### logger

> `readonly` **logger**: [`Logger`](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api-logs.Logger.html)

Defined in: [provider.ts:147](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L147)

OpenTelemetry Logs API logger bound to the configured service name and version.

***

### meter

> `readonly` **meter**: [`Meter`](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api._opentelemetry_api.Meter.html)

Defined in: [provider.ts:145](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L145)

Meter bound to the configured service name and version.

***

### tracer

> `readonly` **tracer**: [`Tracer`](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api._opentelemetry_api.Tracer.html)

Defined in: [provider.ts:143](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L143)

Tracer bound to the configured service name and version.

## Methods

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [provider.ts:163](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L163)

Gracefully shutdown all OTLP providers

Tracing, metrics and logging are stopped independently: a failing signal
does not keep the others from stopping. Afterwards the OpenTelemetry API
global registrations this provider took (and only those) are released.
One failure is rethrown as it is; several are combined in an
`AggregateError`.

Does not clear the process-wide instance: [getProvider](../functions/getProvider.md) keeps
returning this (now shut down) provider. Use [shutdownProvider](../functions/shutdownProvider.md) to
shut down and allow a fresh provider to be created.

#### Returns

`Promise`\<`void`\>

Promise that resolves when shutdown is complete
