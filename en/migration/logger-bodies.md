---
title: Logger Bodies Are Opt-In
description: From 1.3.0, createLoggerInterceptor no longer passes request and response bodies to the log sink unless includeBodies is set.
docType: migration
---

# Logger Bodies Are Opt-In

> Applies to `@connectum/interceptors` 1.3.0.

## Does this apply to you?

You need to act only if **both** are true:

- your code uses `createLoggerInterceptor()` (it is not part of the default chain);
- something reads the **body** of a request or response from the logger's output — a log search for a field value, a sink that inspects the extra argument, or a debugging habit of reading payloads from the console.

If you never read bodies from that log, nothing breaks, and the log stops carrying payloads. If you do not use the logger interceptor, skip this page.

## What changed

Until 1.3.0 the logger passed the request and response message of every call to the log sink as an extra argument, and logged the JSON form of every streamed response message. Bodies carry credentials, tokens and personal data, and a log is kept longer and read by more people than the call itself.

From 1.3.0 a log line carries only metadata:

- the lines keep their text: `RPC <path> request`, `RPC <path> response`, `STREAM <path> request`, `STREAM <path> response`, `failed with <Code>`, `completed in N ms`;
- the extra body argument is gone, so a custom `logger` function receives only the message string;
- streamed response messages are not converted to JSON when bodies are off.

## Required changes

If you need the bodies, ask for them explicitly:

```typescript
createLoggerInterceptor({ includeBodies: true });
```

With `includeBodies: true` the output is the one you had before 1.3.0: a unary call hands its request and response message to the sink, a streaming call hands each request message and the JSON form of each response message.

Enable it only where the log is as protected as the traffic itself: access limited to the people allowed to see the payloads, and a retention period that fits the data they hold.

## Before and after

```typescript
const logger = (message: string, ...args: unknown[]) => sink.write(message, args);

createLoggerInterceptor({ logger });
// 1.2: logger('RPC /pkg.Svc/Method request', { password: '…' })
// 1.3: logger('RPC /pkg.Svc/Method request')

createLoggerInterceptor({ logger, includeBodies: true });
// 1.3: logger('RPC /pkg.Svc/Method request', { password: '…' })   — as in 1.2
```

## Verify the upgrade

Make one call through a server that uses the logger and read what your sink received. Without the option, no argument after the message string and no payload value should appear; with `includeBodies: true`, the request and response bodies should be there.

## Related release notes

- [Request logging](/en/guide/interceptors/built-in#request-logging)
