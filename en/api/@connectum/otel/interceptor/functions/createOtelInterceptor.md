[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [interceptor](../index.md) / createOtelInterceptor

# Function: createOtelInterceptor()

> **createOtelInterceptor**(`options?`): `Interceptor`

Defined in: [packages/otel/src/interceptor.ts:51](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/interceptor.ts#L51)

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
