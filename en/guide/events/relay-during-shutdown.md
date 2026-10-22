---
title: Relay Events During Shutdown
description: Let a handler that consumes an event and publishes another one finish its work while the EventBus stops.
docType: how-to
outline: deep
---

# Relay Events During Shutdown

A relay handler consumes an event, transforms it, and publishes the result as another event. `eventBus.stop()` refuses `bus.publish()` before it drains the handlers, so the last hop of a relay that is still running when shutdown begins used to fail: on a broker the message was redelivered, and with retry plus a dead-letter queue it could be dead-lettered although nothing was wrong with it; on `MemoryAdapter` the next hop was dropped.

**Outcome:** a relay handler that is running when `stop()` begins publishes its result through `ctx.publish`, `stop()` waits for that publish before it disconnects the adapter, and you can see in the `observer` what was admitted, refused, or abandoned. Available since 1.3.0. The shutdown budgets themselves are described in [Shutdown Drain](/en/guide/events#shutdown-drain).

## Prerequisites

- An `EventBus` with at least one handler that publishes another event.
- An adapter that acknowledges after the handler finishes (`NATS`, `Kafka`, `Redis` or `AMQP`; the choice is in [Adapter selection](/en/guide/events/adapters)).

## Publish through the context

Replace the publish through an injected bus with `ctx.publish`. The context belongs to one delivery, so it carries the right to publish for exactly the time that delivery is being handled.

```typescript
import { OrderShippedSchema } from '#gen/orders/v1/events_pb.js';

export const orderEvents: EventRoute = (events) => {
  events.service(OrderEventHandlers, {
    async orderPaid(message, ctx) {
      // Before: await eventBus.publish(OrderShippedSchema, { orderId: message.orderId });
      await ctx.publish(OrderShippedSchema, { orderId: message.orderId });
    },
  });
};
```

Await the call inside the handler. If the publish fails, the handler fails, and retry and the dead-letter queue treat it as any other handler failure. While the bus runs, `ctx.publish` behaves like `bus.publish`.

## What is admitted and what is refused

While `stop()` is draining, a `ctx.publish` call is admitted when all of these hold:

- the handler of that delivery has not returned yet;
- the drain has not been aborted (`drainTimeout` ran out);
- the context belongs to the current start/stop cycle of this bus.

Everything else is refused with an error:

| Call | Result |
|---|---|
| `ctx.publish` from the running handler | Admitted; `stop()` waits for it |
| `ctx.publish` after the handler returned, for example from a timer or a kept reference | Rejected: the right ends with the handler |
| `ctx.publish` after `drainTimeout` aborted the drain | Rejected |
| `ctx.publish` of an abandoned handler after the bus was started again | Rejected |
| `bus.publish` from anywhere while the bus stops | Rejected, with an error that says the bus is stopping |

`stop()` waits for the admitted publishes after the handlers have drained and before the adapter is disconnected, even when the handler did not await them. That wait is bounded by `drainAbortGrace` when it is set and unbounded otherwise, like the wait for the handlers themselves. It shares the grace window that starts at the abort, so the bus budget stays `drainTimeout` + `drainAbortGrace`. It does not use `drainPublishTimeout`, which only covers `bus.publish()` calls that were pending when `stop()` began.

The republish of the built-in [DLQ middleware](/en/guide/events/middleware) made while the bus stops is awaited the same way.

## Verify

Pass an `observer` and stop the bus while a relay handler is running. Each admitted publish is reported, and the adapter is disconnected only after it settled:

```typescript
const eventBus = createEventBus({
  adapter,
  routes: [orderEvents],
  drainTimeout: 15_000,
  drainAbortGrace: 5_000,
  observer: (event) => logger.info({ event }, 'event bus shutdown'),
});
```

Expect `{ type: 'admitted', topic }` for each relayed event. Seeing `{ type: 'rejected', reason: 'aborted' }` means a handler took longer than `drainTimeout`; seeing `{ type: 'abandoned', handlers, publishes }` means work was still running after `drainAbortGrace` and was given up on; the event does not say whether a message will be delivered again, which depends on the broker and on whether the handler had acknowledged it.

## When it does not work

- **The handler uses `ctx.signal` and stops before it publishes.** `ctx.signal` also fires when the server starts shutting down (when the bus is run through `createServer({ eventBus })`) and when `drainTimeout` aborts the drain. A handler that cancels its own work on that signal does not reach the publish. `ctx.publish` itself does not look at `ctx.signal`; it looks at the drain abort.
- **The handler publishes through an injected bus.** That publish is refused while the bus stops. The cost of relaying during shutdown is rewriting such handlers to use `ctx`.
- **The message is delivered again after `stop()`.** The handler was abandoned before it acknowledged, or it failed. With a dead-letter queue configured, a handler that fails during shutdown republishes the event there, and that republish is awaited; make handlers idempotent, because redelivery is the broker's guarantee.

## Related

- [Shutdown Drain](/en/guide/events#shutdown-drain) -- budgets, `observer` events and what is waited for
- [Graceful shutdown](/en/guide/server/graceful-shutdown) -- the transport phase that comes before the bus stops
- [`EventContext`](/en/api/@connectum/events/types/interfaces/EventContext) -- exact signature of `publish`
