---
title: events-amqp 1.3 Behavior Changes
description: What changes for @connectum/events-amqp users when upgrading from 1.2 to 1.3, and what to do about each change.
docType: migration
---

# events-amqp 1.3 Behavior Changes

> Applies when upgrading `@connectum/events-amqp` from 1.2.x to 1.3.0.

## Does this apply to you?

You need to act if your service uses `AmqpAdapter` and any of the following is true:

- you count or alert on `onDisconnected` calls;
- you use `recovery: false` and handle `onDisconnected`;
- you set a finite `recovery.maxRetries`;
- you match connection errors by message text or by `.code` on the error itself;
- a lifecycle callback throws on purpose;
- you pin `amqplib` below 2.2.0 through `overrides`, `resolutions`, or a lockfile
  patch, or you alert on `reconnecting` delay values.

The new options (`publishRetry`, `onLifecycle`, `initialConnectMaxRetries`,
`treatTopologyErrorAsFatal`, `AmqpTopologyError.object`, and the `/testing` subpath)
are opt-in. They are described in
[Run the AMQP adapter reliably](/en/guide/events/amqp-reliability).

## Required changes

### `onDisconnected` fires once per drop {#disconnect-once}

In 1.2, a socket-level connection cut reported the loss twice: once from the raw
connection `error` event and once from the recovery `disconnect` event. In 1.3 it is
reported exactly once, on both `onDisconnected` and `onLifecycle`. A graceful close by
the server was reported once before and still is.

**Action:** expect disconnect counters to drop, roughly by half when most drops are
socket-level cuts. Adjust alert thresholds and dashboards that were calibrated on the
doubled numbers.

### `recovery: false` reports every close, once {#recovery-false-disconnect}

In 1.2, with `recovery: false`, `onDisconnected` ran only on the connection `error`
event, so a close forced by the server without an error (for example, an operator
closing the connection) was not reported at all. In 1.3 the adapter reports
`disconnected` once when the connection closes, with the preceding error as the cause
when there was one, or `Error('Connection closed')` otherwise. It is not reported for
your own `disconnect()` or when `connect()` discards a connection whose setup failed.

**Action:** make sure your `onDisconnected` handler is correct for server-forced
closes too; it now runs for them.

### After recovery gives up, subscribe again {#resubscribe-after-give-up}

When a finite `recovery.maxRetries` was exhausted, 1.2 kept the dead connection:
`connect()` threw `already connected` until you called `disconnect()`, and
`subscribe()` went to the dead connection and failed with an untyped amqplib error.

In 1.3, before reporting `reconnect-failed`, the adapter drops the dead connection,
its publish channel, and **all subscription records**:

- `publish()` and `subscribe()` reject at once with `AmqpConnectionError`;
- `connect()` is accepted without a prior `disconnect()`;
- the new connection starts with no subscriptions.

**Action:** after `reconnect-failed`, subscribe again after `connect()`. With the
EventBus, `bus.stop()` followed by `bus.start()` does this, because `start()` connects
the adapter and subscribes the registered routes. A `disconnect()` call before
`connect()` is no longer needed, and still does no harm.

### The initial connect rejects with `AmqpConnectionError` {#initial-connect-error}

With recovery enabled and a finite `maxRetries`, a broker that stays unreachable for
the whole initial budget used to reject `connect()` with the raw amqplib error (for
example, `ECONNREFUSED`). In 1.3 `connect()` rejects with `AmqpConnectionError`, and
the original error is its `cause`. With `recovery: false` the raw error is still
thrown unchanged.

**Action:** catch `AmqpConnectionError` and read the original error from `cause`:

```typescript
import { AmqpConnectionError } from '@connectum/events-amqp';

try {
  await bus.start();
} catch (err) {
  // 1.2: (err as NodeJS.ErrnoException).code === 'ECONNREFUSED'
  if (err instanceof AmqpConnectionError) {
    const cause = err.cause as NodeJS.ErrnoException | undefined;
    logger.error({ code: cause?.code }, 'AMQP broker unreachable at startup');
  }
  throw err;
}
```

### A `subscribe()` cut off by a dying connection rejects typed {#subscribe-typed-error}

A `subscribe()` that was waiting for a channel when the connection cycle died used to
reject with amqplib's `Error('Connection closed')` or a raw socket error. In 1.3 it
rejects with `AmqpConnectionError`; when the channel could not be created, the
original error is its `cause`. A subscription whose
connection died while it was being set up is no longer recorded, so a later
`connect()` does not restart it.

**Action:** match these failures with `instanceof AmqpConnectionError` instead of the
message text.

### Lifecycle callbacks no longer propagate exceptions {#lifecycle-exceptions}

In 1.2 an exception thrown by a lifecycle callback propagated into amqplib's
connection event handlers. In 1.3 the adapter catches and discards it, so a faulty
callback cannot interfere with recovery, and a throwing `onLifecycle` does not prevent
the flat callbacks from running (or the reverse).

**Action:** if a callback threw to signal a failure, report it another way, such as
logging, a metric, or a flag your health check reads.

### amqplib 2.2.0 is the minimum {#amqplib-2-2}

The dependency range is now `amqplib@^2.2.0`. Reconnect delays are capped so that no
delay exceeds `recovery.maxDelay`; with the defaults a saturated delay is between
20 000 and 30 000 ms.

**Action:** remove any `overrides`, `resolutions`, or pins that hold `amqplib` below
2.2.0. If you alert on the `delay` of `reconnecting` events, check the thresholds
against the bound above.

## Recommended changes

### Move to `onLifecycle` {#move-to-onlifecycle}

The flat callbacks `onConnected`, `onDisconnected`, `onReconnecting`,
`onReconnectFailed`, and `onSetupFailed` are deprecated since 1.3 and kept until at
least 2.0. They receive the same events as `onLifecycle`.

Setting `onLifecycle` enables the startup topology check, as `onSetupFailed` and
`failFastOnInitialSetupError` already did: with recovery enabled and
`initialConnectMaxRetries` unset, `connect()` opens one extra short-lived connection
and validates the topology before connecting. A service that used only
`onConnected` or `onDisconnected` in 1.2 did not run this check.

## Before and after

```typescript
// 1.2
const adapter = AmqpAdapter({
  url,
  lifecycle: {
    onConnected: () => health.set('amqp', true),
    onDisconnected: (err) => {
      health.set('amqp', false);
      metrics.amqpDisconnects.inc(); // counted twice per socket-level cut
    },
    onReconnectFailed: (err) => logger.error({ err }, 'AMQP recovery gave up'),
  },
});

// 1.3
const adapter = AmqpAdapter({
  url,
  lifecycle: {
    // Also enables the startup topology check (one extra connection at connect()).
    onLifecycle: (event) => {
      if (event.type === 'connected') health.set('amqp', true);
      if (event.type === 'disconnected') {
        health.set('amqp', false);
        metrics.amqpDisconnects.inc(); // once per drop
      }
      if (event.type === 'reconnect-failed') {
        // Subscriptions are gone: restart the bus or the service.
        logger.error({ err: event.error }, 'AMQP recovery gave up');
      }
    },
  },
});
```

## Verify the upgrade

- Cut the broker connection (for example, restart RabbitMQ) and check that each drop
  increments your disconnect counter once.
- With a finite `maxRetries`, start the service with the broker stopped and check that
  startup fails with `AmqpConnectionError` and the original error in `cause`.
- In unit tests, use `FakeAmqpAdapter` from `@connectum/events-amqp/testing`:
  `control.dropConnection()` followed by `control.exhaustRecovery()` puts the fake in
  the terminal state, after which `connect()` succeeds without the old subscriptions.

## Related release notes

- [Run the AMQP adapter reliably](/en/guide/events/amqp-reliability)
- [`@connectum/events-amqp` package page](/en/packages/events-amqp)
- [Connectum GitHub releases](https://github.com/Connectum-Framework/connectum/releases)
