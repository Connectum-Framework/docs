[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [logger](../index.md) / createLoggerInterceptor

# Function: createLoggerInterceptor()

> **createLoggerInterceptor**(`options?`): `Interceptor`

Defined in: [logger.ts:86](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/interceptors/src/logger.ts#L86)

Create logger interceptor

Logs all RPC requests and responses with timing information.
Supports both unary and streaming RPCs.

## Parameters

### options?

[`LoggerOptions`](../../interfaces/LoggerOptions.md) = `{}`

Logger options

## Returns

`Interceptor`

ConnectRPC interceptor

## Examples

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

```typescript
import { createConnectTransport } from '@connectrpc/connect-node';
import { createLoggerInterceptor } from '@connectum/interceptors';

const transport = createConnectTransport({
  baseUrl: 'http://localhost:5000',
  interceptors: [
    createLoggerInterceptor({ level: 'debug' }),
  ],
});
```
