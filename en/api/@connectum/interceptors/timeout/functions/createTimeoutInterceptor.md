[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [timeout](../index.md) / createTimeoutInterceptor

# Function: createTimeoutInterceptor()

> **createTimeoutInterceptor**(`options?`): `Interceptor`

Defined in: [timeout.ts:64](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/timeout.ts#L64)

Create timeout interceptor

Prevents requests from hanging indefinitely by enforcing a timeout.
Propagates cancellation to downstream work and rejects with DeadlineExceeded
when its own deadline expires. Caller cancellation preserves its ConnectError
reason, or becomes Canceled when the caller supplies another reason.
Handlers and I/O must observe the signal to stop work; cancellation does not
roll back side effects or forcibly stop signal-unaware code.

Streaming is skipped by default. With skipStreaming=false, the timeout covers
opening the response, not subsequent iteration. Caller cancellation continues
to reach an opened stream after the opening timer has been cleared.

## Parameters

### options?

[`TimeoutOptions`](../../interfaces/TimeoutOptions.md) = `{}`

Timeout options

## Returns

`Interceptor`

ConnectRPC interceptor

## Examples

**Server-side usage with createServer**

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

**Client-side usage with transport**

```typescript
import { createConnectTransport } from '@connectrpc/connect-node';
import { createTimeoutInterceptor } from '@connectum/interceptors';

const transport = createConnectTransport({
  baseUrl: 'http://localhost:5000',
  httpVersion: '1.1',
  interceptors: [
    createTimeoutInterceptor({ duration: 10000 }),
  ],
});
```
