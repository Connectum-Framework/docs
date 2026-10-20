---
title: Error Handler Keeps Non-Connect Messages on the Server
description: From 1.3.0, the error handler no longer sends the text of exceptions that are not ConnectError or SanitizableError to the client unless exposeErrorMessages is set.
docType: migration
---

# Error Handler Keeps Non-Connect Messages on the Server

> Applies to `@connectum/interceptors` 1.3.0.

## Does this apply to you?

You need to act only if **both** are true:

- your server runs `errorHandler`: it is the first interceptor of `createDefaultInterceptors()`, and you may also add it with `createErrorHandlerInterceptor()`;
- a client reads the **text** of an error that a handler raised as a plain `Error`, a thrown string, or an object with a numeric `code` — a UI that shows `err.message`, a test that matches it, or a client that parses it.

A `ConnectError` and a `SanitizableError` are not affected: their text reaches the client as before. If your handlers throw only those, or your clients read only the code, skip this page. If you run the server with `errorHandler: false`, this interceptor does not run and nothing changes.

## What changed

Until 1.3.0 the text of any exception reached the caller. It often carries a connection string, a query, a path or a request value, and it was sent to every client.

From 1.3.0 a client receives:

| Thrown by the handler | Client receives |
|---|---|
| `ConnectError` | Unchanged: code, text, details, metadata |
| `SanitizableError` | Its `clientMessage` and code; `serverDetails` stay on the server |
| `Error` or a thrown string | `Internal` with the text `internal error` |
| An error with a numeric `code` that is an integer from 1 to 16 | That code with an empty text |
| An error with any other numeric `code` (`0`, `17`, `1.5`, `NaN`, an HTTP status, an errno) | `Internal` with the text `internal error` |

A numeric `code` is adopted only when it is one of the Connect failure codes, 1 to 16. A handler that threw an object with another number (for example an HTTP status such as `404`) used to reach the client as a transport-dependent result: an `invalid grpc-status` text or a protocol error over gRPC, `Unknown` over Connect. Now it is `Internal` everywhere; to send a specific code, throw a `ConnectError` with it.

The original failure stays on the server: as `cause` of the `ConnectError` that `errorHandler` throws (no transport serializes `cause`), as `info.error` of `onError` with its original text, and in the console log. The behavior is the same over gRPC, Connect and `server.localClient()`.

`errorHandler` is a server interceptor. It changes what the server sends; a client needs no upgrade, and its own interceptors see the new text.

If you put `otel` before `errorHandler` (the order the `connectum init` scaffold generates), the span records the error that `errorHandler` throws, so its status message is the generic text; the original is in `onError` and the console log.

## Required changes

Choose one for each place a client depended on the text:

- **Send a message on purpose.** Throw a `ConnectError` with the code and text you want the caller to see, or a `SanitizableError` with a `clientMessage`. This is the recommended path.
- **Read the code, not the text.** Clients should branch on `err.code` (or on typed details of a `ConnectError`).
- **Restore the old behavior.** Set `exposeErrorMessages: true` on the error handler. Use it only when every caller is trusted (internal clients behind a gateway) or while debugging. The option is server-side, defaults to `false` and does not depend on `NODE_ENV`.

```typescript
import { createDefaultInterceptors, createErrorHandlerInterceptor } from '@connectum/interceptors';

// Through the default chain
createDefaultInterceptors({ errorHandler: { exposeErrorMessages: true } });

// Or with the interceptor on its own
createErrorHandlerInterceptor({ exposeErrorMessages: true });
```

## Before and after

```typescript
import { Code, ConnectError } from '@connectrpc/connect';

// A handler throws a plain error.
throw new Error('db connect failed: password=hunter2');
// 1.2: client gets Internal, "db connect failed: password=hunter2"
// 1.3: client gets Internal, "internal error"
//      onError and the console log still receive the original text.

// A handler throws an error that carries a numeric code.
throw Object.assign(new Error('denied by rule 7'), { code: Code.PermissionDenied });
// 1.2: client gets PermissionDenied, "denied by rule 7"
// 1.3: client gets PermissionDenied, ""

// A handler throws a ConnectError: same in both versions.
throw new ConnectError('order not found', Code.NotFound);
// 1.2 and 1.3: client gets NotFound, "order not found"
```

## Verify the upgrade

Call a handler that throws a plain `Error` with a recognizable text through your real server. The client error should carry `internal error` and no part of that text; the same text should appear in your `onError` callback or console log. Then set `exposeErrorMessages: true` and repeat: the client should receive the original text.

## Related release notes

- [What a client sees when a handler fails](/en/guide/interceptors/built-in#what-a-client-sees-when-a-handler-fails)
- [Custom interceptors](/en/guide/interceptors/custom)
