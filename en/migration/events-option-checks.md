---
title: Event Bus Option Checks
description: From 1.3.0, createEventBus, retryMiddleware and dlqMiddleware refuse timeout, retry and dead-letter options that used to be accepted and break deliveries, and a failed dead-letter publish is reported to the observer.
docType: migration
---

# Event Bus Option Checks

> Applies to `@connectum/events` 1.3.0.

## Does this apply to you?

You need to act only if one of these is true:

- you pass `handlerTimeout` of `0`, a fraction, `NaN`, a negative number, `Infinity`, a number above `4294967295`, or a value that is not a number;
- you pass `drainTimeout` of `NaN`, a negative number, `Infinity`, a number above `2147483647`, or a value that is not a number;
- you pass `retry.initialDelay`, `retry.maxDelay` or `retry.multiplier` outside the ranges in the table below, or a `retry.backoff` that is not `"exponential"`, `"linear"` or `"fixed"`;
- you configure `dlq` without a `topic`, or with an empty or blank one;
- you switch over `EventBusObserverEvent` exhaustively and need a branch for the new `dlq-failed` event.

Valid configurations behave as before. If none of these applies, the upgrade needs no action here.

## What changed

| Option | Accepted | Before | From 1.3.0 |
|---|---|---|---|
| `handlerTimeout` | integer, `1` to `4294967295` ms | A bad value made `AbortSignal.timeout()` throw on every delivery, so the handler never ran; `0` aborted the handler signal at once | `createEventBus` throws |
| `drainTimeout` | finite, `0` to `2147483647` ms | `NaN` and negative values aborted running handlers as soon as `stop()` was called; `Infinity` and larger numbers never aborted them and made the drain loop poll every millisecond | `createEventBus` throws |
| `retry.initialDelay` | finite, `0` to `2147483647` ms | Pauses of 1 to 3 ms and timer warnings | `retryMiddleware` throws |
| `retry.maxDelay` | finite, `1` to `2147483647` ms | The same | `retryMiddleware` throws |
| `retry.multiplier` | finite, at least `1` | The same | `retryMiddleware` throws |
| `retry.backoff` | `"exponential"`, `"linear"`, `"fixed"` | An unknown name behaved as `"fixed"` | `retryMiddleware` throws |
| `dlq.topic` | non-empty string | `dlq: {}` and `topic: ""` were accepted and every failed event was lost | `createEventBus` and `dlqMiddleware` throw |

Each error is a `RangeError` (a value outside the range) or a `TypeError` (the wrong type) whose message starts with the factory, names the option and shows the received value. An option you leave out keeps its default. `createBroadcastSubscribers` forwards `handlerTimeout` and `drainTimeout`, so it throws for the same values.

## Fix a configuration that now throws

Replace the value with one inside the range, or remove the option to take the default:

```typescript
createEventBus({
  adapter,
  handlerTimeout: 30_000, // not 0, not 30_000.5, not Infinity
  drainTimeout: 15_000, // not NaN, not -1, not Infinity
  middleware: {
    retry: { initialDelay: 200, maxDelay: 10_000, multiplier: 2, backoff: 'exponential' },
    dlq: { topic: 'orders.dlq' },
  },
});
```

A `handlerTimeout` that was meant as "no limit" has no equivalent: pick a number larger than your slowest handler. A fraction is refused because Node.js refuses it in `AbortSignal.timeout()`; Bun accepts it, and the bus refuses it on both so a configuration that works on one runtime does not fail every delivery on the other.

## A failed dead-letter publish is now visible

When the DLQ middleware cannot publish a failed event, it still nacks the original without requeue and does not rethrow, as before. From 1.3.0 the bus `observer` receives `{ type: 'dlq-failed', topic, eventType, eventId, error }` for it, at any time. Log it there:

```typescript
createEventBus({
  adapter,
  middleware: { dlq: { topic: 'orders.dlq' } },
  observer: (event) => {
    if (event.type === 'dlq-failed') {
      logger.error({ topic: event.topic, eventId: event.eventId }, 'event lost: dead-letter publish failed');
    }
  },
});
```

## A stop no longer dead-letters an event that is waiting between retries

When `server.stop()` or `eventBus.stop()` ends a retry pause, the event used to be published to the DLQ with `dlq.error` `AbortError` (or `UnknownError`) and acknowledged, although it was never retried. It now goes back to the broker (`nack` with requeue) and the DLQ stays empty. The broker delivers it again after the restart with a fresh retry budget, so handlers must be idempotent. See [Stopping during a retry pause](/en/guide/events/middleware#stopping-during-a-retry-pause).

Code that counted `dlq.error=AbortError` events on shutdown no longer sees them for events that were only waiting.
