[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [retry](../index.md) / createRetryInterceptor

# Function: createRetryInterceptor()

> **createRetryInterceptor**(`options?`): `Interceptor`

Defined in: [retry.ts:61](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/retry.ts#L61)

Create retry interceptor

Automatically retries failed unary RPC calls with exponential backoff.
Only retries on configurable error codes (Unavailable and ResourceExhausted by default).
Cancellation interrupts backoff and prevents future attempts. An already
running handler is awaited so bulkheads continue to account for active work;
handlers and I/O must observe the signal to stop promptly. A cancelled attempt
cannot become a successful retry result when it completes later.

Use retries only for idempotent operations. Streaming is skipped by default;
opting in retries opening failures, not errors while consuming an opened stream.

`maxRetries` must be a finite number of at least 0 (fractions allowed);
`initialDelay` and `maxDelay` must be integers from 0 to 2147483647
milliseconds. Anything else throws at construction (`TypeError` for a
non-number, `RangeError` otherwise).

## Parameters

### options?

[`RetryOptions`](../../interfaces/RetryOptions.md) = `{}`

Retry options

## Returns

`Interceptor`

ConnectRPC interceptor

## Example

**Server-side usage with createServer**

```typescript
import { createServer } from '@connectum/core';
import { Code } from '@connectrpc/connect';
import { createRetryInterceptor } from '@connectum/interceptors';
import { myRoutes } from './routes.js';

const server = createServer({
  services: [myRoutes],
  interceptors: [
    createRetryInterceptor({
      maxRetries: 3,
      initialDelay: 200,
      maxDelay: 5000,
      retryableCodes: [Code.Unavailable, Code.ResourceExhausted],
    }),
  ],
});

await server.start();
```
