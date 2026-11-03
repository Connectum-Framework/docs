[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / getOTLPSettings

# Function: getOTLPSettings()

> **getOTLPSettings**(): [`OTLPSettings`](../interfaces/OTLPSettings.md)

Defined in: [config.ts:164](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/config.ts#L164)

Gets OTLP exporter settings from environment variables

Environment variables:
- OTEL_TRACES_EXPORTER: Trace exporter type (console|otlp|otlp/http|otlp/http-protobuf|otlp/grpc|none)
- OTEL_METRICS_EXPORTER: Metric exporter type (console|otlp|otlp/http|otlp/http-protobuf|otlp/grpc|none)
- OTEL_LOGS_EXPORTER: Logs exporter type (console|otlp|otlp/http|otlp/http-protobuf|otlp/grpc|none)
- OTEL_EXPORTER_OTLP_PROTOCOL (and OTEL_EXPORTER_OTLP_<TRACES|METRICS|LOGS>_PROTOCOL):
  transport for the bare `otlp` value (grpc|http/protobuf|http/json); `grpc` selects
  OTLP/gRPC, `http/protobuf` protobuf-encoded OTLP/HTTP, `http/json` JSON-encoded
  OTLP/HTTP; unset means `http/protobuf`

An exporter variable that is unset, empty or not recognised yields the OpenTelemetry
default, `otlp`, which resolves through the protocol variables like the explicit value:
OTLP/HTTP with a protobuf body unless a protocol variable says otherwise, sent to
`http://localhost:4318` unless an endpoint variable says otherwise. Set the variable to
`console` to print telemetry to standard output, or to `none` to disable the signal.
Values are matched case-insensitively. A value that is not recognised (a
comma-separated list included) is ignored with a process warning (code
`CONNECTUM_OTEL_INVALID_ENV`); this function never throws for the environment.

## Returns

[`OTLPSettings`](../interfaces/OTLPSettings.md)

OTLP settings object
