[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [errorHandler](../index.md) / createErrorHandlerInterceptor

# Function: createErrorHandlerInterceptor()

> **createErrorHandlerInterceptor**(`options?`): `Interceptor`

Defined in: [errorHandler.ts:87](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/errorHandler.ts#L87)

Create error handler interceptor

Catches rejections from awaiting next(req) and transforms them into
ConnectError instances with proper error codes. Recognizes SanitizableError for safe
client-facing messages while preserving server details for logging.

What a client receives for each kind of thrown value:
- `ConnectError`: passes through unchanged, text and details included. Its author
  chose to send them.
- `SanitizableError`: its `clientMessage` and code only; `serverDetails` stay on the server.
- Anything else (`Error`, a thrown string, an object with a numeric `code`): the code is
  the numeric `code` when it is an integer from 1 to 16 (a Connect failure code) and
  `Internal` otherwise (no code, a non-number, or a number outside 1..16). The text of the failure
  is NOT sent: `Internal` carries the fixed text `"internal error"`, any other code carries
  an empty text. A message such as a connection string or a query would otherwise leak
  to every caller (CWE-209). Set `exposeErrorMessages: true` to send the original text.

The original failure always stays on the server: as `cause` of the thrown ConnectError
(no transport serializes `cause`), in `onError` as `info.error` with its original text,
and in the console log.

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
