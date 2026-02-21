[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [timeout](../index.md) / createTimeoutInterceptor

# Function: createTimeoutInterceptor()

> **createTimeoutInterceptor**(`options?`): `Interceptor`

Defined in: [timeout.ts:55](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/timeout.ts#L55)

Create timeout interceptor

Prevents requests from hanging indefinitely by enforcing a timeout.
Requests that exceed the timeout are cancelled and throw DeadlineExceeded error.

## Parameters

### options?

[`TimeoutOptions`](../../interfaces/TimeoutOptions.md) = `{}`

Timeout options

## Returns

`Interceptor`

ConnectRPC interceptor

## Examples

```typescript
import { createServer } from '@connectum/core';
import { createTimeoutInterceptor } from '@connectum/interceptors';
import { myRoutes } from './routes.js';

const server = createServer({
  services: [myRoutes],
  interceptors: [
    createTimeoutInterceptor({
      duration: 30000,      // 30 second timeout
      skipStreaming: true,  // Skip streaming calls
    }),
  ],
});

await server.start();
```

```typescript
import { createConnectTransport } from '@connectrpc/connect-node';
import { createTimeoutInterceptor } from '@connectum/interceptors';

const transport = createConnectTransport({
  baseUrl: 'http://localhost:5000',
  interceptors: [
    createTimeoutInterceptor({ duration: 10000 }),
  ],
});
```
