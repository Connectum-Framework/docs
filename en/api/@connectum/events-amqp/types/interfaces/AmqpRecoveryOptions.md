[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpRecoveryOptions

# Interface: AmqpRecoveryOptions

Defined in: [packages/events-amqp/src/types.ts:420](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L420)

Recovery knobs (passed through to amqplib's opt-in recovery).

`maxRetries` governs BOTH the initial connect and every subsequent recovery
series, with the counter reset on each success — so a finite value chosen only
to bound startup also caps steady-state recovery and makes the adapter brittle
(N consecutive transient failures in any single series stop it permanently).
The reconnect delay is symmetric jitter around a capped exponential base —
uniform in `[base × (1 − jitter), base × (1 + jitter)]`, rounded, with
`base = min(maxDelay / (1 + jitter), initialDelay × factor^(attempt − 1))`.
Capping the base below `maxDelay` means the largest jitter offset lands
exactly on `maxDelay`, so a delay never exceeds it: at the defaults a
saturated delay lies in `[20000, 30000]` ms. This is amqplib's built-in
formula (amqplib ≥ 2.2.0, the minimum this package requires); it applies
to every reconnect attempt, including those of the bounded initial connect,
and the adapter's own `publishRetry` uses the same one.

Full jitter with a hard cap is expressible with these knobs: for an intended
schedule `I × factor^(n − 1)` capped at `C`, set `jitter: 1`,
`initialDelay: I / 2` and `maxDelay: C`. The delay for attempt `n` is then
uniform in `[0, min(I × factor^(n − 1), C)]`.

The initial connect CAN be bounded independently since 1.3.0 — see
[AmqpRecoveryOptions.initialConnectMaxRetries](#initialconnectmaxretries). A schedule the knobs
cannot express is set with [AmqpRecoveryOptions.backoff](#backoff).

## Properties

### backoff?

> `readonly` `optional` **backoff?**: (`attempt`) => `number`

Defined in: [packages/events-amqp/src/types.ts:517](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L517)

Custom reconnect delay: called with the attempt number, returns the
delay in milliseconds before that attempt. Forwarded to amqplib's
`calculateDelay`. Since 1.3.0.

- `attempt` is 1-based and restarts at 1 after every successful connect.
- Covers every reconnect attempt: steady-state recovery and the retries
  of the initial connect (with or without `initialConnectMaxRetries`).
  It does NOT cover `publishRetry`, which keeps its own numeric backoff.
- The return value must be a finite number ≥ 0. It is rounded to whole
  milliseconds and applied as is — NOT clamped to `maxDelay`; cap it
  yourself (`Math.min(cap, …)`). `0` is valid and retries at once. The
  `reconnecting` event reports this applied delay; the adapter never
  calls the hook a second time to fill it.
- The hook MUST be synchronous. A throw, a return that is not a finite
  number ≥ 0 (`NaN`, `Infinity`, a negative number, a numeric string)
  or a Promise (an `async` function) ends recovery for good — there is
  no fallback to the built-in schedule. During the initial connect,
  `connect()` rejects, and with `initialConnectMaxRetries` the terminal
  `reconnect-failed` is reported first; without it the initial loop runs
  before the lifecycle wiring attaches, so no event is reported. In
  steady state the terminal `reconnect-failed` fires once and the
  adapter drops the dead connection, as after an exhausted
  `maxRetries`. Either way the error is an
  `AmqpConnectionError` whose `cause` is the hook's error (the thrown
  error, or one stating the invalid return or that the hook must be
  synchronous) and whose message names the last connection error —
  "none observed" when it failed before the adapter could see one
  (initial connect without `initialConnectMaxRetries`).
- It only sets intervals. Retry budgets stay `maxRetries` and
  `initialConnectMaxRetries`, and both remain valid with the hook.
- Cannot be combined with `initialDelay`, `maxDelay`, `factor` or
  `jitter`: amqplib ignores them once a hook is set, so the adapter
  rejects the combination at construction with a `TypeError`.
- A schedule that depends on the previous delay (decorrelated jitter)
  needs state across calls: keep it in a closure.

#### Parameters

##### attempt

`number`

#### Returns

`number`

#### Example

**Full jitter over an exponential schedule, capped at 30 s**

```typescript
recovery: {
    backoff: (n) => Math.random() * Math.min(30_000, 100 * 2 ** (n - 1)),
}
```

***

### factor?

> `readonly` `optional` **factor?**: `number`

Defined in: [packages/events-amqp/src/types.ts:426](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L426)

#### Default

```ts
2
```

***

### initialConnectMaxRetries?

> `readonly` `optional` **initialConnectMaxRetries?**: `number`

Defined in: [packages/events-amqp/src/types.ts:471](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L471)

Bound the retry budget of the INITIAL connect independently of
steady-state recovery: N retries = N+1 attempts, mirroring `maxRetries`
semantics. A single `maxRetries` cannot express "bounded startup,
unbounded steady-state" — its counter resets on every success.

Set to a finite number N, the initial connect makes at most
`max(0, floor(N)) + 1` attempts (a negative value means a single
attempt, a fraction is rounded down). A value that is not a finite
number — `Infinity`, `NaN` — counts as unset. The budget ends with the
first successful connect; after that `maxRetries` bounds every recovery
series.

amqplib runs these attempts itself (its `initialMaxRetries`) on the
recovering connection the adapter keeps: each attempt includes the full
topology setup, and after a success exactly one adapter connection stays
open on the broker. The adapter's lifecycle wiring is attached before
the first attempt, so the initial window reports `reconnecting` for
every scheduled retry (with the applied delay) and
`setup-failed { initial: true, attempt }` for a topology failure
(`attempt` is the 0-based index of the failed attempt). On exhaustion
the adapter reports one terminal `reconnect-failed`, then `connect()`
rejects with `AmqpConnectionError` stating the attempt count and the
budget, with the last attempt's error as `cause` — never a silent
block. Delays follow the knobs above, like every reconnect delay.

`publish()` and `subscribe()` called before the initial connect
succeeds reject with `AmqpConnectionError` ("not connected"), and the
initial `connected` event is delivered only once the adapter is usable.
`disconnect()` during the initial connect cancels a pending retry at
once; `connect()` then rejects with `AmqpConnectionError` ("Adapter
closed during the initial connect phase") and no lifecycle event
follows. `failFastOnInitialSetupError` still stops the initial connect
on the first topology error, budget notwithstanding.

Unset (default): amqplib's initial loop with the shared `maxRetries`
governs startup, and initial-window per-retry events are not surfaced.
Since 1.3.0.

***

### initialDelay?

> `readonly` `optional` **initialDelay?**: `number`

Defined in: [packages/events-amqp/src/types.ts:422](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L422)

#### Default

```ts
100
```

***

### jitter?

> `readonly` `optional` **jitter?**: `number`

Defined in: [packages/events-amqp/src/types.ts:428](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L428)

Symmetric jitter factor (0..1): the delay is uniform in `[base × (1 − jitter), base × (1 + jitter)]` around the capped base.

#### Default

```ts
0.2
```

***

### maxDelay?

> `readonly` `optional` **maxDelay?**: `number`

Defined in: [packages/events-amqp/src/types.ts:424](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L424)

Upper bound of every reconnect delay in ms: the base is capped at `maxDelay / (1 + jitter)`, so jitter never pushes a delay above it.

#### Default

```ts
30000
```

***

### maxRetries?

> `readonly` `optional` **maxRetries?**: `number`

Defined in: [packages/events-amqp/src/types.ts:430](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L430)

Attempts per series (initial connect and each recovery series); resets on success. To bound ONLY startup, use [initialConnectMaxRetries](#initialconnectmaxretries).

#### Default

```ts
Infinity
```
