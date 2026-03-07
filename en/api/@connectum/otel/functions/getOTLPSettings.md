[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / getOTLPSettings

# Function: getOTLPSettings()

> **getOTLPSettings**(): [`OTLPSettings`](../interfaces/OTLPSettings.md)

Defined in: [packages/otel/src/config.ts:65](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/otel/src/config.ts#L65)

Gets OTLP exporter settings from environment variables

Environment variables:
- OTEL_TRACES_EXPORTER: Trace exporter type (console|otlp/http|otlp/grpc|none)
- OTEL_METRICS_EXPORTER: Metric exporter type (console|otlp/http|otlp/grpc|none)
- OTEL_LOGS_EXPORTER: Logs exporter type (console|otlp/http|otlp/grpc|none)

## Returns

[`OTLPSettings`](../interfaces/OTLPSettings.md)

OTLP settings object
