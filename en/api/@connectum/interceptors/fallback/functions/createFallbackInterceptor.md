[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [fallback](../index.md) / createFallbackInterceptor

# Function: createFallbackInterceptor()

> **createFallbackInterceptor**\<`T`\>(`options`): `Interceptor`

Defined in: [fallback.ts:60](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/fallback.ts#L60)

Create fallback interceptor

Provides fallback response when service fails, enabling graceful degradation.
The handler returns the RPC response message, not a response wrapper.
In the server example, getCachedData is application code that returns that message.

## Type Parameters

### T

`T` = `unknown`

## Parameters

### options

[`FallbackOptions`](../../interfaces/FallbackOptions.md)\<`T`\>

Fallback options

## Returns

`Interceptor`

ConnectRPC interceptor

## Examples

**Server-side usage with createServer**

```typescript
import { createServer } from '@connectum/core';
import { createFallbackInterceptor } from '@connectum/interceptors';
import { myRoutes } from './routes.js';

const server = createServer({
  services: [myRoutes],
  interceptors: [
    createFallbackInterceptor({
      handler: (error) => {
        console.error('Service failed, returning cached data:', error);
        return getCachedData();
      },
      skipStreaming: true,
    }),
  ],
});

await server.start();
```

**Client-side usage with transport**

```typescript
import { createConnectTransport } from '@connectrpc/connect-node';
import { createFallbackInterceptor } from '@connectum/interceptors';

const transport = createConnectTransport({
  baseUrl: 'http://localhost:5000',
  httpVersion: '1.1',
  interceptors: [
    createFallbackInterceptor({
      handler: () => ({ data: [] }),
    }),
  ],
});
```
