[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / ExporterType

# Variable: ExporterType

> `const` **ExporterType**: `object`

Defined in: [packages/otel/src/config.ts:19](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/config.ts#L19)

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
