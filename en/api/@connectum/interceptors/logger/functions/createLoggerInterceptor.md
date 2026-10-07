[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [logger](../index.md) / createLoggerInterceptor

# Function: createLoggerInterceptor()

> **createLoggerInterceptor**(`options?`): `Interceptor`

Defined in: [logger.ts:216](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/logger.ts#L216)

Create logger interceptor

Logs RPC requests and responses with timing information. By default,
skips calls whose service type name contains `grpc.health`; set
`skipHealthCheck: false` to include them.
Supports both unary and streaming RPCs.

## Parameters

### options?

[`LoggerOptions`](../../interfaces/LoggerOptions.md) = `{}`

Logger options

## Returns

`Interceptor`

ConnectRPC interceptor

## Examples

**Server-side usage with createServer**

```typescript
import { createServer } from '@connectum/core';
import { createLoggerInterceptor } from '@connectum/interceptors';
import { myRoutes } from './routes.js';

const server = createServer({
  services: [myRoutes],
  interceptors: [
    createLoggerInterceptor({
      level: 'debug',
      skipHealthCheck: true,
    }),
  ],
});

await server.start();
```

**Tag log lines with the transport (opt-in)**

```typescript
createLoggerInterceptor({ includeTransport: true });
// RPC [in-process] /greeter.v1.GreeterService/SayHello request ...   (server.localClient)
// RPC [http] /greeter.v1.GreeterService/SayHello request ...         (network client)
```

**Log request and response bodies (opt-in)**

```typescript
// Bodies can carry credentials and personal data; enable only where the log is protected.
createLoggerInterceptor({ includeBodies: true });
```

**Client-side usage with transport**

```typescript
import { createConnectTransport } from '@connectrpc/connect-node';
import { createLoggerInterceptor } from '@connectum/interceptors';

const transport = createConnectTransport({
  baseUrl: 'http://localhost:5000',
  httpVersion: '1.1',
  interceptors: [
    createLoggerInterceptor({ level: 'debug' }),
  ],
});
```
