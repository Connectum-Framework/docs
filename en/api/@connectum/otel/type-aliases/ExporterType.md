[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / ExporterType

# Type Alias: ExporterType

> **ExporterType** = *typeof* [`ExporterType`](../variables/ExporterType.md)\[keyof *typeof* [`ExporterType`](../variables/ExporterType.md)\]

Defined in: [config.ts:20](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/config.ts#L20)

Available exporter types

- CONSOLE: Outputs telemetry to stdout
- OTLP_HTTP: Sends telemetry via OTLP/HTTP, JSON-encoded (`Content-Type: application/json`)
- OTLP_HTTP_PROTOBUF: Sends telemetry via OTLP/HTTP, protobuf-encoded (`Content-Type: application/x-protobuf`)
- OTLP_GRPC: Sends telemetry via OTLP/gRPC protocol
- NONE: Disables telemetry export
