---
title: Request logging interceptor
description: Log RPC metadata and duration without exposing message bodies by default.
docType: how-to
outline: deep
---

# Request logging interceptor

`createLoggerInterceptor()` is not part of the default chain. Add it when you
need request, response and duration records for RPCs. Health checks are skipped
by default:

```typescript
import { createServer } from '@connectum/core';
import { createDefaultInterceptors, createLoggerInterceptor } from '@connectum/interceptors';

const server = createServer({
  services: [routes],
  interceptors: [
    ...createDefaultInterceptors(),
    createLoggerInterceptor({
      level: 'info',
      skipHealthCheck: true,
      includeTransport: true,
      includeBodies: false,
    }),
  ],
});
```

`level` defaults to `debug`, `skipHealthCheck` to `true`, and both
`includeTransport` and `includeBodies` to `false`.

`skipHealthCheck` matches `grpc.health` as whole package segments, including
`grpc.health.v1.Health` and a prefixed `acme.grpc.health.v1.Probe`. It does not
skip `acme.grpc.healthcare.v1.Svc`, whose longer segment only contains the text.

`skipHealthCheck`, `includeTransport` and `includeBodies` must be booleans.
`level` must be `"debug"`, `"info"`, `"warn"` or `"error"`, and a supplied
`logger` must be a function. Wrong types throw `TypeError`; an unsupported
string level throws `RangeError`. These checks run at construction.

## What a call writes

```text
RPC /greeter.v1.GreeterService/SayHello request
RPC /greeter.v1.GreeterService/SayHello response
RPC /greeter.v1.GreeterService/SayHello completed in 1.84ms
```

A failing call writes `RPC <path> failed with <Code>` before completion. The
code is the Connect code name, or `Unknown` for other errors; the original error
reaches the caller unchanged. Streams log `STREAM <path> request` and
`STREAM <path> response` for each message. Their duration covers the whole stream
until it is fully read, fails or is closed early with `break` or `return()`.

## Transport tags

With `includeTransport: true`, each line adds `[in-process]` for
`server.localClient()` and `createLocalTransport()` calls, or `[http]` for other
calls, immediately after `RPC`/`STREAM`:

```text
RPC [in-process] /greeter.v1.GreeterService/SayHello request
RPC [http] /greeter.v1.GreeterService/SayHello completed in 1.84ms
```

The tag comes from an internal request marker and is telemetry only. Never use
it to authorize a call; use `req.service.typeName` and `req.method.name`.
With the option disabled, records have no transport tag.

## Message bodies are opt-in

By default no request or response body reaches the `logger` function. Bodies
can contain credentials, tokens and personal data; logs often outlive the call
and have more readers.

With `includeBodies: true`, unary calls pass their request/response message as
an extra argument. Streams pass each request message and the JSON form of each
response message:

```typescript
createLoggerInterceptor({ includeBodies: true });
// logger('RPC /greeter.v1.GreeterService/SayHello request', { name: 'Ada' })
```

Enable this only when logs are protected as carefully as the traffic. See the
[migration guide](/en/migration/logger-bodies).

## Logging failures do not replace RPC results

If the supplied logger throws or rejects, the RPC still returns its response or
original error. The first logging failure is reported once on the console;
later failures are dropped. A streamed message that cannot be converted to JSON
is logged as a marker and the stream continues.

See [LoggerOptions](/en/api/@connectum/interceptors/interfaces/LoggerOptions).
For structured application logging and exporters, use
[Observability logging](/en/guide/observability/logging).
