[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [interceptor](../index.md) / createOtelInterceptor

# Function: createOtelInterceptor()

> **createOtelInterceptor**(`options?`): `Interceptor`

Defined in: [packages/otel/src/interceptor.ts:52](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/otel/src/interceptor.ts#L52)

Creates a ConnectRPC interceptor that instruments RPC calls with
OpenTelemetry tracing and/or metrics.

The interceptor follows OpenTelemetry semantic conventions for RPC:
- Creates server spans with standard RPC attributes
- Records call duration, request size, and response size metrics
- Supports context propagation with configurable trust mode
- Handles both unary and streaming calls

## Parameters

### options?

[`OtelInterceptorOptions`](../../interfaces/OtelInterceptorOptions.md) = `{}`

Configuration options for the interceptor

## Returns

`Interceptor`

A ConnectRPC Interceptor function

## Example

```typescript
import { createOtelInterceptor } from '@connectum/otel';
import { createServer } from '@connectum/core';

const server = createServer({
    services: [routes],
    interceptors: [createOtelInterceptor({
        serverPort: 5000,
        filter: ({ service }) => !service.includes("Health"),
    })],
});
```
