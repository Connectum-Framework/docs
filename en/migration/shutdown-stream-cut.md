---
title: Streams Cut by stop()
description: From 1.3.0, a server stream cut by server.stop() ends with unavailable instead of a normal end of stream.
docType: migration
---

# Streams Cut by `stop()`

> Applies to 1.3.0.

## Does this apply to you?

It applies if you serve server streams (or bidirectional streams), their handlers can still be sending when `server.stop()` runs, and a client treats the end of a stream as "the list is complete" or retries only on errors. A service without long-running streams needs no change.

## What changed {#cut-streams}

Until 1.3.0, `server.stop()` ended a server stream whose handler ignored `ctx.signal` with a successful end of stream: a Connect client got an end-stream frame without an error and a gRPC client got `grpc-status: 0`, after a truncated list of messages.

From 1.3.0 the client receives the messages already sent and then `unavailable` ("the server is shutting down"), over Connect, gRPC and in-process calls. A deadline that expires while the stream is sending ends it with `deadline_exceeded`, and a client abort with `canceled`. Not changed: a handler that returns by itself after it sees the abort still ends the call normally, and a handler that rethrows the abort reason is reported as before.

**Required change:** make sure a client of a long-running stream handles `unavailable` the way it handles any other error that means "reconnect and resume", instead of reading the earlier clean end as completion.

See [Graceful Shutdown](/en/guide/server/graceful-shutdown#streams-on-stop) for the full table of how a stream can end.

## Verify the upgrade

Run your test suite with a test that starts the server, begins a long server stream whose handler ignores its signal, stops the server, and asserts that the client sees `unavailable` after the messages already sent.
