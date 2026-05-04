[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [errorHandler](../index.md) / createErrorHandlerInterceptor

# Function: createErrorHandlerInterceptor()

> **createErrorHandlerInterceptor**(`options?`): `Interceptor`

Defined in: [errorHandler.ts:48](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/interceptors/src/errorHandler.ts#L48)

Create error handler interceptor

Catches all errors and transforms them into ConnectError instances
with proper error codes. Recognizes SanitizableError for safe
client-facing messages while preserving server details for logging.

IMPORTANT: This interceptor should be FIRST in the chain to catch all errors.

## Parameters

### options?

[`ErrorHandlerOptions`](../../interfaces/ErrorHandlerOptions.md) = `{}`

Error handler options

## Returns

`Interceptor`

ConnectRPC interceptor

## Example

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
