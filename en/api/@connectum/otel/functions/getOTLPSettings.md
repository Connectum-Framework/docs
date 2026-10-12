[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / getOTLPSettings

# Function: getOTLPSettings()

> **getOTLPSettings**(): [`OTLPSettings`](../interfaces/OTLPSettings.md)

Defined in: [config.ts:102](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/config.ts#L102)

Gets OTLP exporter settings from environment variables

Environment variables:
- OTEL_TRACES_EXPORTER: Trace exporter type (console|otlp|otlp/http|otlp/http-protobuf|otlp/grpc|none)
- OTEL_METRICS_EXPORTER: Metric exporter type (console|otlp|otlp/http|otlp/http-protobuf|otlp/grpc|none)
- OTEL_LOGS_EXPORTER: Logs exporter type (console|otlp|otlp/http|otlp/http-protobuf|otlp/grpc|none)
- OTEL_EXPORTER_OTLP_PROTOCOL (and OTEL_EXPORTER_OTLP_<TRACES|METRICS|LOGS>_PROTOCOL):
  transport for the bare `otlp` value (grpc|http/protobuf|http/json); `grpc` selects
  OTLP/gRPC, `http/protobuf` protobuf-encoded OTLP/HTTP, `http/json` JSON-encoded
  OTLP/HTTP; unset means `http/protobuf`

## Returns

[`OTLPSettings`](../interfaces/OTLPSettings.md)

OTLP settings object
