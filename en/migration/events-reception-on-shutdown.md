---
title: Event Bus Stops Receiving at the Shutdown Signal
description: From 1.3.0 the event bus stops receiving when the shutdown signal aborts, instead of when its stop hook runs.
docType: migration
---

# Event Bus Stops Receiving at the Shutdown Signal

> Applies to 1.3.0.

## Does this apply to you?

You need to check your code only if **both** are true:

- you pass an `eventBus` to `createServer()` (or start a bus yourself with `start({ signal })` or the `signal` option);
- something relies on a message that arrives **after** the shutdown began still being handled by that service instance.

A service whose handlers are idempotent and whose broker redelivers unacknowledged messages needs no changes.

## What changed

`server.stop()` aborts the server's shutdown signal first and stops the bus by a [shutdown hook](/en/guide/server/graceful-shutdown#eventbus) later, up to `shutdown.timeout` after the abort. Until 1.3.0 the bus kept receiving in that interval: a message that arrived started a handler whose `ctx.signal` was already aborted. The retry middleware does not retry after a cancellation, so a transient failure went straight to the dead-letter queue when one was configured.

From 1.3.0 the bus stops receiving **when the signal aborts**:

- it ends its subscriptions;
- a delivery that is already on its way is returned to the broker with a requeue, so it is handled after the restart or by another consumer of the group;
- handlers that are running are not touched: they finish, can still publish through `ctx.publish`, and `stop()` drains them and disconnects as before;
- the subscriptions are ended once, whichever of the abort and `stop()` comes first.

A bus you start yourself behaves the same way with its own signal: after the abort it handles no delivery, but `publish()` keeps working until `stop()` releases it. Starting a bus with a signal that is already aborted subscribes and ends the subscriptions at once.

## Required changes

Usually none. Check these cases:

- **You count on a last message being handled during shutdown.** It is now handled by the next instance. Make sure the handler is idempotent, as at-least-once delivery already requires.
- **You abort a signal that you gave to a bus and then keep using it for receiving.** Do not abort it until you want reception to end; call `bus.stop()` to release the bus.
- **You use your own signal for other purposes.** The bus reacts to the signal you pass it, so pass a signal whose abort means "stop receiving".

## Verify the upgrade

In a test with a real or in-memory broker, start the service, begin a slow handler, call `server.stop()` without awaiting it, publish a message and check that the slow handler finishes and the new message is not handled by this instance but is delivered to the next one.

## Related release notes

- [Graceful shutdown: EventBus](/en/guide/server/graceful-shutdown#eventbus)
- [Shutdown drain](/en/guide/events#shutdown-drain)
