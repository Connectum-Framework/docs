[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [fallback](../index.md) / createFallbackInterceptor

# Function: createFallbackInterceptor()

> **createFallbackInterceptor**\<`T`\>(`options`): `Interceptor`

Defined in: [fallback.ts:57](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/fallback.ts#L57)

Create fallback interceptor

Provides fallback response when service fails, enabling graceful degradation.

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
        return { message: getCachedData() };
      },
      skipStreaming: true,
    }),
  ],
});

await server.start();
```

```typescript
import { createConnectTransport } from '@connectrpc/connect-node';
import { createFallbackInterceptor } from '@connectum/interceptors';

const transport = createConnectTransport({
  baseUrl: 'http://localhost:5000',
  interceptors: [
    createFallbackInterceptor({
      handler: () => ({ data: [] }),
    }),
  ],
});
```
