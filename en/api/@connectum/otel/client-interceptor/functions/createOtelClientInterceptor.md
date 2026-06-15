[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [client-interceptor](../index.md) / createOtelClientInterceptor

# Function: createOtelClientInterceptor()

> **createOtelClientInterceptor**(`options`): `Interceptor`

Defined in: [packages/otel/src/client-interceptor.ts:59](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/otel/src/client-interceptor.ts#L59)

Creates a ConnectRPC interceptor that instruments outgoing RPC calls with
OpenTelemetry tracing and/or metrics.

The interceptor follows OpenTelemetry semantic conventions for RPC:
- Creates client spans with standard RPC attributes
- Injects trace context into outgoing request headers for propagation
- Records call duration, request size, and response size metrics
- Handles both unary and streaming calls

## Parameters

### options

[`OtelClientInterceptorOptions`](../../interfaces/OtelClientInterceptorOptions.md)

Configuration options for the client interceptor

## Returns

`Interceptor`

A ConnectRPC Interceptor function

## Example

```typescript
import { createOtelClientInterceptor } from '@connectum/otel';
import { createConnectTransport } from '@connectrpc/connect-node';

const transport = createConnectTransport({
    baseUrl: 'http://localhost:5000',
    interceptors: [createOtelClientInterceptor({
        serverAddress: 'localhost',
        serverPort: 5000,
        filter: ({ service }) => !service.includes("Health"),
    })],
});
```
