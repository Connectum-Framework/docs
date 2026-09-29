---
title: Configure AMQP Connection Recovery
description: Bound the initial broker connect, replace the reconnect delay schedule, and handle recovery give-up in @connectum/events-amqp.
docType: how-to
outline: deep
---

# Configure AMQP Connection Recovery

`@connectum/events-amqp` reconnects to the broker on its own: recovery is
delegated to amqplib's built-in recovery and is enabled by default. This page
shows how to bound the initial connect at startup, how to set your own reconnect
delay schedule, and how the adapter reports the moment recovery gives up.

**Outcome:** a service whose startup fails with a typed error instead of blocking
forever, and whose reconnect delays follow a schedule you chose. Broker selection
is covered in [Choose an Event Adapter](/en/guide/events/adapters); every option
with its exact type and default is in the generated
[`AmqpRecoveryOptions`](/en/api/@connectum/events-amqp/types/interfaces/AmqpRecoveryOptions)
reference.

## Before you begin {#before-you-begin}

- An EventBus that uses `AmqpAdapter`, as in [Choose an Event Adapter](/en/guide/events/adapters#amqp--rabbitmq-adapter).
- Recovery left enabled. `recovery: true` (the default) uses amqplib's defaults;
  an `AmqpRecoveryOptions` object tunes them; `recovery: false` disables recovery,
  so `connect()` rejects at once when the broker is unreachable and a lost
  connection is not restored. Nothing on this page applies to `recovery: false`.
- The `recovery.backoff` hook requires `@connectum/events-amqp` 1.4.0 or later.

## How recovery behaves by default {#default-behavior}

With recovery enabled, a lost connection is retried with a growing delay, and on
every successful (re)connect the adapter re-creates its channels, re-applies the
topology and replays active subscriptions.

- **Retry budget.** `maxRetries` (default `Infinity`) bounds each series of
  attempts — the initial connect and every later recovery series; the counter
  resets on success. Under the default, `connect()` (and so `bus.start()`) waits
  until the broker is reachable. A finite `maxRetries` chosen only to bound
  startup also stops steady-state recovery after that many consecutive failures,
  so prefer `initialConnectMaxRetries` for startup (next section).
- **Delay.** The built-in schedule is exponential (`initialDelay`, `factor`) with
  symmetric `jitter`, and a delay never exceeds `maxDelay` (default 30 s).
- **Initial-connect observability.** Without `initialConnectMaxRetries`, the
  retries of the initial connect happen before the adapter's lifecycle wiring is
  attached, so they do not emit `reconnecting` events. When a finite `maxRetries`
  runs out during that window, `connect()` rejects with `AmqpConnectionError`
  whose `cause` is the last connection error.
- **Give-up is terminal.** When recovery gives up, the adapter drops the dead
  connection and its subscriptions and reports the terminal `reconnect-failed`
  lifecycle event. After that `publish()` and `subscribe()` reject with
  `AmqpConnectionError`, and a new `connect()` starts from a clean state —
  re-subscribe explicitly.

## Bound the initial connect {#bounded-initial-connect}

Set `recovery.initialConnectMaxRetries` to fail startup after a fixed number of
attempts while keeping unbounded recovery once the service has connected:

```typescript
import { createEventBus } from '@connectum/events';
import { AmqpAdapter } from '@connectum/events-amqp';

const bus = createEventBus({
  adapter: AmqpAdapter({
    url: 'amqp://guest:guest@localhost:5672',
    recovery: {
      initialConnectMaxRetries: 5, // at most 6 attempts at startup
    },
  }),
  routes: [eventRoutes],
});

await bus.start(); // rejects with AmqpConnectionError when the budget runs out
```

- **Attempt count.** A finite value N allows at most `max(0, floor(N)) + 1`
  attempts: a negative value means one attempt and a fraction is rounded down.
  A value that is not a finite number — `Infinity` or `NaN` — counts as unset.
- **Scope.** The budget ends with the first successful connect. After that,
  `maxRetries` bounds every recovery series.
- **Who runs the attempts.** Since 1.4.0, amqplib runs these attempts itself (its
  `initialMaxRetries` option) on the recovering connection the adapter keeps.
  Every attempt includes the full topology setup, a success leaves exactly one
  adapter connection open on the broker, and exhaustion leaves none. Earlier
  releases validated each attempt on a separate short-lived connection and then
  opened the recovering connection.
- **Events.** The lifecycle wiring is attached before the first attempt, so every
  scheduled retry emits `reconnecting` with its 1-based `attempt` and the applied
  `delay`, and a topology failure emits `setup-failed` with `initial: true` and
  the 0-based index of the failed attempt.
- **Exhaustion.** The adapter emits exactly one `reconnect-failed`, then
  `connect()` rejects with
  `AmqpConnectionError("Initial connect failed after N attempt(s) (initialConnectMaxRetries: M)")`
  whose `cause` is the last attempt's error.
- **Before the first success.** `publish()` and `subscribe()` reject with the
  typed "not connected" `AmqpConnectionError`, and the initial `connected` event
  arrives only once the adapter is usable.
- **Shutdown.** `disconnect()` during the initial connect cancels a pending retry
  at once; `connect()` then rejects with `AmqpConnectionError` ("Adapter closed
  during the initial connect phase") and no further lifecycle event follows.
- **Fail-fast.** With `failFastOnInitialSetupError: true`, the first topology
  error stops the initial connect and `connect()` rejects with that
  `AmqpTopologyError`, whatever budget is left.

Delays between these attempts follow the same schedule as every other reconnect:
the numeric knobs, or the `recovery.backoff` hook when it is set.

## Set a custom reconnect delay {#custom-backoff-hook}

Since 1.4.0, `recovery.backoff` replaces the built-in delay schedule with your
own function. It receives the attempt number and returns the delay in
milliseconds before that attempt; the adapter forwards it to amqplib's
`calculateDelay`.

```typescript
backoff?: (attempt: number) => number
```

Full jitter over an exponential schedule, capped at 30 s:

```typescript
recovery: {
  backoff: (n) => Math.random() * Math.min(30_000, 100 * 2 ** (n - 1)),
}
```

- **`attempt`** is 1-based and restarts at 1 after every successful connect.
- **Coverage.** The hook sets the delay of every reconnect attempt: steady-state
  recovery and the retries of the initial connect, with or without
  `initialConnectMaxRetries`. It does **not** cover `publishRetry`, which keeps
  its own numeric backoff.
- **Return value.** A finite number greater than or equal to 0, rounded to whole
  milliseconds and applied as is. It is **not** clamped to `maxDelay`, so put the
  cap into the function (`Math.min(cap, …)`, as above). `0` retries at once. The
  `reconnecting` event reports this applied delay; the adapter never calls the
  hook a second time to fill it.
- **Budgets.** The hook only sets intervals. `maxRetries` and
  `initialConnectMaxRetries` still bound the number of attempts and remain valid
  alongside it.
- **Not combinable with the delay knobs.** `initialDelay`, `maxDelay`, `factor`
  and `jitter` have no effect once a hook is set, so combining any of them with
  `backoff` throws a `TypeError` when the adapter is constructed.
- **State across calls.** A schedule that depends on the previous delay, such as
  decorrelated jitter, keeps that state in a closure — the hook receives only the
  attempt number.

::: warning A failing hook ends recovery for good
The hook must be synchronous. If it throws, returns anything but a finite number
greater than or equal to 0 (`NaN`, `Infinity`, a negative number, a numeric
string), or returns a Promise (an `async` function), recovery gives up. There is
no fallback to the built-in schedule.

- During the initial connect, `connect()` rejects.
- In steady state, the terminal `reconnect-failed` fires once and the adapter
  drops the dead connection and its subscriptions, exactly as after an exhausted
  `maxRetries`.

Either way the error is an `AmqpConnectionError`. Its `cause` is the hook's
error: the thrown error, or an error stating the invalid return or that the hook
must be synchronous. Its message names the last connection error, or says "none
observed" when the hook failed during an initial connect without
`initialConnectMaxRetries` — a window the adapter cannot observe.
:::

## Verify {#verify}

Log the lifecycle events, start the service while the broker is stopped, then
start the broker:

```typescript
AmqpAdapter({
  url: 'amqp://guest:guest@localhost:5672',
  recovery: {
    initialConnectMaxRetries: 5,
    backoff: (n) => Math.random() * Math.min(30_000, 100 * 2 ** (n - 1)),
  },
  lifecycle: {
    onLifecycle: (event) => {
      if (event.type === 'reconnecting') console.log(`retry ${event.attempt} in ${event.delay} ms: ${event.error.message}`);
      if (event.type === 'reconnect-failed') console.error('recovery gave up', event.error);
      if (event.type === 'connected') console.log(`connected (reconnected: ${event.reconnected})`);
    },
  },
});
```

- Each scheduled retry logs one `reconnecting` line with an increasing
  `attempt` and the delay your hook returned, rounded to whole milliseconds —
  one line after each of the first five failed attempts.
- Once the broker is up, one `connected (reconnected: false)` line appears.
- With the broker kept down, the sixth failed attempt produces one
  `reconnect-failed`, and `bus.start()` rejects with the
  "Initial connect failed after 6 attempt(s)" error.
- Stopping the broker after a successful connect restarts the attempt numbers at
  1 and ends with `connected (reconnected: true)` once the broker returns.

## Troubleshooting {#troubleshooting}

| Symptom | Cause | Fix |
|---|---|---|
| `TypeError: AmqpAdapter: recovery.backoff cannot be combined with recovery.<knob> …` at construction | `backoff` is set together with `initialDelay`, `maxDelay`, `factor` or `jitter` | Remove the knob and compute the delay, including its cap, inside the hook |
| `AmqpConnectionError: Recovery gave up: recovery.backoff failed at attempt N (…)` | The hook threw, returned an invalid value, or is `async` | Read `error.cause`; make the hook synchronous and return a finite number greater than or equal to 0 |
| `AmqpConnectionError: Initial connect failed after N attempt(s) (initialConnectMaxRetries: M)` | The broker stayed unreachable, or setup kept failing, for the whole startup budget | Read `error.cause` for the last attempt's error; raise the budget or fix connectivity |
| `AmqpConnectionError: Initial connect failed: recovery gave up (maxRetries: N)` | A finite `maxRetries` ran out during startup without `initialConnectMaxRetries` | Bound startup with `initialConnectMaxRetries` and leave `maxRetries` at its default |
| `AmqpConnectionError: Adapter closed during the initial connect phase` | `disconnect()` or shutdown ran while the initial connect was still retrying | Expected during shutdown; no action |
| `bus.start()` never resolves | Default budget (`Infinity`) and an unreachable broker | Set `initialConnectMaxRetries` |

## Learn / Configure / API reference {#api-reference}

- **Learn:** [Choose an Event Adapter](/en/guide/events/adapters)
- **Configure:** [`@connectum/events-amqp` module hub](/en/packages/events-amqp)
- **API reference:** [`AmqpRecoveryOptions`](/en/api/@connectum/events-amqp/types/interfaces/AmqpRecoveryOptions), [`AmqpLifecycleCallbacks`](/en/api/@connectum/events-amqp/types/interfaces/AmqpLifecycleCallbacks)
