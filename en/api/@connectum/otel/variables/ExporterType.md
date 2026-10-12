[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / ExporterType

# Variable: ExporterType

> `const` **ExporterType**: `object`

Defined in: [config.ts:20](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/config.ts#L20)

Available exporter types

- CONSOLE: Outputs telemetry to stdout
- OTLP_HTTP: Sends telemetry via OTLP/HTTP, JSON-encoded (`Content-Type: application/json`)
- OTLP_HTTP_PROTOBUF: Sends telemetry via OTLP/HTTP, protobuf-encoded (`Content-Type: application/x-protobuf`)
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

### OTLP\_HTTP\_PROTOBUF

> `readonly` **OTLP\_HTTP\_PROTOBUF**: `"otlp/http-protobuf"` = `"otlp/http-protobuf"`
