[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [retry](../index.md) / createRetryInterceptor

# Function: createRetryInterceptor()

> **createRetryInterceptor**(`options?`): `Interceptor`

Defined in: [retry.ts:44](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/interceptors/src/retry.ts#L44)

Create retry interceptor

Automatically retries failed unary RPC calls with exponential backoff.
Only retries on configurable error codes (Unavailable and ResourceExhausted by default).

## Parameters

### options?

[`RetryOptions`](../../@connectum/interceptors/interfaces/RetryOptions.md) = `{}`

Retry options

## Returns

`Interceptor`

ConnectRPC interceptor

## Example

```typescript
import { createServer } from '@connectum/core';
import { createRetryInterceptor } from '@connectum/interceptors';

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
