---
title: NATS Adapter Options
description: From 1.3.0, NatsAdapter() validates servers, ackWait, maxDeliver and deliverPolicy when it is created, and publish metadata reaches the handler as it was given.
docType: migration
---

# NATS Adapter Options

> Applies to 1.3.0.

## Does this apply to you?

You need to act only if a `NatsAdapter()` configuration of yours passes one of the values below. Each used to be accepted; each now throws when the adapter is created, so the service fails at start-up and not when the first event is handled.

| Option | Refused now | What it did before |
|---|---|---|
| `options` | missing, `null` or not an object | a missing `options` failed with a `TypeError` on the first property read |
| `servers` | `""`, a blank string, `[]`, an array with an empty or non-string entry, any other type | `[]` made the client connect to its local default address |
| `consumerOptions.ackWait` | `0`, a negative number, `NaN`, `Infinity`, a string, a value whose nanoseconds do not fit an exact integer | `0` became the 30 s default; `-1` made the server redeliver at once |
| `consumerOptions.maxDeliver` | `0`, a number below `-1`, a fraction, `NaN`, a string | `0` and `-2` were accepted; `1.5` failed at the first `subscribe()` with a server error |
| `consumerOptions.deliverPolicy` | anything but `"new"`, `"all"`, `"last"` (a different case such as `"ALL"` included) | an unknown value behaved like `"new"` |
| `consumerOptions` | not an object | was accepted |

A scaffolded project reads `NATS_SERVERS ?? "nats://localhost:4222"`: if the variable is set but empty (`NATS_SERVERS=`), the empty string is passed on and `NatsAdapter()` now throws. Unset the variable or give it a value.

Valid values behave as before. `ackWait` may still be a fraction of a millisecond count; it is sent to the server as whole nanoseconds.

## Behavior that changed without an error

- **Metadata.** Keys that start with `x-` and empty values passed in `PublishOptions.metadata` now reach the handler. Before, the NATS adapter dropped them, so a handler that read `x-request-id` got nothing on NATS and a value on Redis. Only `x-event-id` stays the adapter's own. If a handler relied on the absence of such a key, or counted `ctx.metadata` entries, check it.
- **Logs.** The adapter now logs `[EventBus/NATS]` lines in three situations: the last delivery `maxDeliver` allows was given back, the server lost a consumer together with its stream (and the consumer is created again), and a consumer was deleted while its stream still exists. See [NATS JetStream](/en/guide/events/adapters#nats-jetstream-adapter).
- **Resumption.** A subscription whose stream was deleted and created again now receives events again; before it stayed silent.

## Required changes

Replace the refused value with a valid one, or remove it to get the default:

```typescript
// before: each of these was accepted
NatsAdapter({ servers: [], consumerOptions: { ackWait: 0, maxDeliver: 0, deliverPolicy: 'ALL' } });

// after
NatsAdapter({ servers: 'nats://localhost:4222', consumerOptions: { deliverPolicy: 'all' } });
```

## Verify

Start the service: the constructor throws with the option's name and the allowed values if a refused value is still in use. To see the new metadata behavior, publish with `metadata: { 'x-request-id': 'r1' }` and read `ctx.metadata.get('x-request-id')` in the handler.
