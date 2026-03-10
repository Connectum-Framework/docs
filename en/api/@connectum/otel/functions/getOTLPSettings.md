[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / getOTLPSettings

# Function: getOTLPSettings()

> **getOTLPSettings**(): [`OTLPSettings`](../interfaces/OTLPSettings.md)

Defined in: [packages/otel/src/config.ts:65](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/otel/src/config.ts#L65)

Gets OTLP exporter settings from environment variables

Environment variables:
- OTEL_TRACES_EXPORTER: Trace exporter type (console|otlp/http|otlp/grpc|none)
- OTEL_METRICS_EXPORTER: Metric exporter type (console|otlp/http|otlp/grpc|none)
- OTEL_LOGS_EXPORTER: Logs exporter type (console|otlp/http|otlp/grpc|none)

## Returns

[`OTLPSettings`](../interfaces/OTLPSettings.md)

OTLP settings object
