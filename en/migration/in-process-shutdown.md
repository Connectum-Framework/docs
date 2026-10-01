---
title: In-Process Calls on Shutdown
description: From 1.3.0, server.stop() aborts the signal of in-flight in-process calls exactly like HTTP calls.
docType: migration
---

# In-Process Calls on Shutdown

> Applies to 1.3.0.

## Does this apply to you?

You need to act only if **both** are true:

- your code makes in-process calls — `server.localClient()`, `server.client()` for a locally mounted service, `createLocalTransport()`, or `ctx.call` / `ctx.stream` to a local service;
- a handler on that path watches `context.signal` (directly, or through a library that honours it, such as a database driver given the signal), **and** you rely on such calls finishing during `server.stop()`.

Handlers that never look at `context.signal` behave as before.

## What changed

Until 1.3.0, the in-process router never received the server's shutdown signal. `server.stop()` aborted `context.signal` of calls received over HTTP only, while local calls kept running unaware of the shutdown — a difference the [parity invariant](/en/contributing/parity-invariant) does not allow.

From 1.3.0, `server.stop()` aborts `context.signal` of every in-flight call on both transports:

- a handler or stream that rethrows the abort ends the call with `canceled`, as over HTTP;
- every hop of a local `ctx.call` chain sees the abort directly;
- a pending [`requestGate`](/en/guide/security/request-admission) that watches the signal is released;
- a local call made after `stop()` starts with an already-aborted signal.

What did not change: `stop()` still neither waits for in-process calls nor kills them — the shutdown timeout and `forceCloseOnTimeout` act on connections, and an in-process call has none.

## Required changes

If work started through an in-process call must complete during shutdown:

- await it before calling `server.stop()`, or
- run it in a [shutdown hook](/en/guide/server/graceful-shutdown#shutdown-hooks) and await it there.

Not passing `context.signal` to an operation only keeps it from being cancelled. It does not make `server.stop()` wait for the call, so use it only when some other owner already awaits that operation's completion.

## Before and after

```typescript
const server = createServer({ services: [routes], port: 0 });
await server.start();

const pending = server.localClient(ReportService).build({ id: '42' });
await server.stop();

// 1.2: `build` kept running; its context.signal stayed live.
// 1.3: `build` sees context.signal aborted; if it rethrows,
//      `pending` rejects with ConnectError code `canceled`.
const outcome = await Promise.allSettled([pending]);
```

## Verify the upgrade

Run your test suite with a test that starts the server, begins a long in-process call, stops the server, and asserts the outcome you expect for that call.

## Related release notes

- [Graceful shutdown: in-process calls](/en/guide/server/graceful-shutdown#in-process-calls)
- [In-process transport](/en/guide/production/in-process-transport)
