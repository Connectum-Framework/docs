[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / getCollectorOptions

# Function: getCollectorOptions()

> **getCollectorOptions**(): [`CollectorOptions`](../interfaces/CollectorOptions.md)

Defined in: [config.ts:118](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/config.ts#L118)

Gets collector endpoint options from environment variables

Environment variables:
- OTEL_EXPORTER_OTLP_ENDPOINT: Collector endpoint URL; empty is treated as not set

## Returns

[`CollectorOptions`](../interfaces/CollectorOptions.md)

Collector options object
