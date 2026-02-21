[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [client-interceptor](../index.md) / createOtelClientInterceptor

# Function: createOtelClientInterceptor()

> **createOtelClientInterceptor**(`options`): `Interceptor`

Defined in: [packages/otel/src/client-interceptor.ts:58](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/client-interceptor.ts#L58)

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
