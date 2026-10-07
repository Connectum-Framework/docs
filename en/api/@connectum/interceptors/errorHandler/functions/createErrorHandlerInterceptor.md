[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [errorHandler](../index.md) / createErrorHandlerInterceptor

# Function: createErrorHandlerInterceptor()

> **createErrorHandlerInterceptor**(`options?`): `Interceptor`

Defined in: [errorHandler.ts:49](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/errorHandler.ts#L49)

Create error handler interceptor

Catches rejections from awaiting next(req) and transforms them into
ConnectError instances with proper error codes. Recognizes SanitizableError for safe
client-facing messages while preserving server details for logging.

Place this interceptor first to normalize rejections from downstream interceptors.
It does not wrap response-stream iteration after next(req) returns, or errors
from request gates that run before the interceptor chain.

## Parameters

### options?

[`ErrorHandlerOptions`](../../interfaces/ErrorHandlerOptions.md) = `{}`

Error handler options

## Returns

`Interceptor`

ConnectRPC interceptor

## Example

**Server-side usage with createServer**

```typescript
import { createServer } from '@connectum/core';
import { createErrorHandlerInterceptor } from '@connectum/interceptors';
import { myRoutes } from './routes.js';

const server = createServer({
  services: [myRoutes],
  interceptors: [
    createErrorHandlerInterceptor({
      onError: ({ error, code, serverDetails, stack }) => {
        logger.error('RPC error', { error: error.message, code, serverDetails, stack });
      },
    }),
  ],
});

await server.start();
```
