[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / getCollectorOptions

# Function: getCollectorOptions()

> **getCollectorOptions**(): [`CollectorOptions`](../interfaces/CollectorOptions.md)

Defined in: [config.ts:185](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/config.ts#L185)

Gets collector endpoint options from environment variables

Environment variables:
- OTEL_EXPORTER_OTLP_ENDPOINT: Collector endpoint URL; empty is treated as not set

A value that cannot be a URL is ignored with a process warning (code
`CONNECTUM_OTEL_INVALID_ENV`) and reads as not set. A bare `host:port` is kept: the
OTLP/gRPC exporter accepts it, and the OTLP/HTTP exporters check the scheme themselves
(see `getHttpExporterOptions`).

## Returns

[`CollectorOptions`](../interfaces/CollectorOptions.md)

Collector options object
