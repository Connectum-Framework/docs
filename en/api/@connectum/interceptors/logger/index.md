[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / logger

# logger

Logger interceptor

Logs RPC requests, responses, failures and duration. By default, calls whose
service type name contains `grpc.health` are excluded. Message bodies are
logged only when `includeBodies` is set.

## Functions

- [createLoggerInterceptor](functions/createLoggerInterceptor.md)
