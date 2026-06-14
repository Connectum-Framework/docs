[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / ExporterType

# Variable: ExporterType

> `const` **ExporterType**: `object`

Defined in: [packages/otel/src/config.ts:19](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/otel/src/config.ts#L19)

Available exporter types

- CONSOLE: Outputs telemetry to stdout
- OTLP_HTTP: Sends telemetry via OTLP/HTTP protocol
- OTLP_GRPC: Sends telemetry via OTLP/gRPC protocol
- NONE: Disables telemetry export

## Type Declaration

### CONSOLE

> `readonly` **CONSOLE**: `"console"` = `"console"`

### NONE

> `readonly` **NONE**: `"none"` = `"none"`

### OTLP\_GRPC

> `readonly` **OTLP\_GRPC**: `"otlp/grpc"` = `"otlp/grpc"`

### OTLP\_HTTP

> `readonly` **OTLP\_HTTP**: `"otlp/http"` = `"otlp/http"`
