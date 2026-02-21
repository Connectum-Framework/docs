[Connectum API Reference](../../../../../index.md) / [@connectum/otel](../../../index.md) / [@connectum/otel](../index.md) / ExporterType

# Type Alias: ExporterType

> **ExporterType** = *typeof* [`ExporterType`](../variables/ExporterType.md)\[keyof *typeof* [`ExporterType`](../variables/ExporterType.md)\]

Defined in: [packages/otel/src/config.ts:19](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/config.ts#L19)

Available exporter types

- CONSOLE: Outputs telemetry to stdout
- OTLP_HTTP: Sends telemetry via OTLP/HTTP protocol
- OTLP_GRPC: Sends telemetry via OTLP/gRPC protocol
- NONE: Disables telemetry export
