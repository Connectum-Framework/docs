[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / client-interceptor

# client-interceptor

ConnectRPC OpenTelemetry client interceptor

Creates a ConnectRPC interceptor that instruments outgoing RPC calls with
OpenTelemetry tracing and metrics following semantic conventions.

Key differences from the server interceptor:
- Uses `propagation.inject()` to propagate trace context to outgoing requests
- Uses `SpanKind.CLIENT` instead of `SpanKind.SERVER`
- Uses `rpc.client.*` metrics instead of `rpc.server.*`
- `serverAddress` is REQUIRED (target server, not local hostname)
- No `trustRemote` option (client always creates spans in active context)

## See

 - https://opentelemetry.io/docs/specs/semconv/rpc/connect-rpc/
 - https://opentelemetry.io/docs/specs/semconv/rpc/rpc-metrics/

## Functions

- [createOtelClientInterceptor](functions/createOtelClientInterceptor.md)
