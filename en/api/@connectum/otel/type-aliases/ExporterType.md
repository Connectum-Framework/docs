[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / ExporterType

# Type Alias: ExporterType

> **ExporterType** = *typeof* [`ExporterType`](../variables/ExporterType.md)\[keyof *typeof* [`ExporterType`](../variables/ExporterType.md)\]

Defined in: [packages/otel/src/config.ts:19](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/config.ts#L19)

Available exporter types

- CONSOLE: Outputs telemetry to stdout
- OTLP_HTTP: Sends telemetry via OTLP/HTTP protocol
- OTLP_GRPC: Sends telemetry via OTLP/gRPC protocol
- NONE: Disables telemetry export
