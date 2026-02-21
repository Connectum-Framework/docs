[Connectum API Reference](../../../../../index.md) / [@connectum/otel](../../../index.md) / [@connectum/otel](../index.md) / getOTLPSettings

# Function: getOTLPSettings()

> **getOTLPSettings**(): [`OTLPSettings`](../interfaces/OTLPSettings.md)

Defined in: [packages/otel/src/config.ts:65](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/config.ts#L65)

Gets OTLP exporter settings from environment variables

Environment variables:
- OTEL_TRACES_EXPORTER: Trace exporter type (console|otlp/http|otlp/grpc|none)
- OTEL_METRICS_EXPORTER: Metric exporter type (console|otlp/http|otlp/grpc|none)
- OTEL_LOGS_EXPORTER: Logs exporter type (console|otlp/http|otlp/grpc|none)

## Returns

[`OTLPSettings`](../interfaces/OTLPSettings.md)

OTLP settings object
