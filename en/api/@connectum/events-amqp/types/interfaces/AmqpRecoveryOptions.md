[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpRecoveryOptions

# Interface: AmqpRecoveryOptions

Defined in: [packages/events-amqp/src/types.ts:378](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L378)

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
formula (amqplib ≥ 2.2.0, the minimum this package requires), and the
adapter's own delay sites — `initialConnectMaxRetries` and `publishRetry` —
use the same one.

Full jitter with a hard cap is expressible with these knobs: for an intended
schedule `I × factor^(n − 1)` capped at `C`, set `jitter: 1`,
`initialDelay: I / 2` and `maxDelay: C`. The delay for attempt `n` is then
uniform in `[0, min(I × factor^(n − 1), C)]`.

The initial connect CAN be bounded independently since 1.3.0 — see
[AmqpRecoveryOptions.initialConnectMaxRetries](#initialconnectmaxretries). amqplib ≥ 2.2.0 also
has its own `initialMaxRetries` and a `calculateDelay` backoff hook; the
adapter passes neither through. A pluggable backoff hook on the adapter is
tracked in [https://github.com/Connectum-Framework/connectum/issues/199](https://github.com/Connectum-Framework/connectum/issues/199).

## Properties

### factor?

> `readonly` `optional` **factor?**: `number`

Defined in: [packages/events-amqp/src/types.ts:384](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L384)

#### Default

```ts
2
```

***

### initialConnectMaxRetries?

> `readonly` `optional` **initialConnectMaxRetries?**: `number`

Defined in: [packages/events-amqp/src/types.ts:424](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L424)

Bound the retry budget of the INITIAL connect independently of
steady-state recovery: N retries = N+1 attempts, mirroring `maxRetries`
semantics. A single `maxRetries` cannot express "bounded startup,
unbounded steady-state" — its counter resets on every success.

When set to an explicit finite value (a negative value clamps to `0` —
single attempt — mirroring amqplib's `maxRetries` normalization), the
adapter owns the initial window with a bounded validate-connect loop
(the startup probe folds into it — validation IS each attempt, no extra
connects): every
attempt surfaces per-attempt lifecycle events (`reconnecting` with the
next delay, `setup-failed { initial: true, attempt }` for topology
failures), and budget exhaustion rejects `connect()` with a typed
`AmqpConnectionError` after a terminal `reconnect-failed` — never a
silent block. Backoff uses the same formula as amqplib's steady-state
recovery (same knobs above; a delay never exceeds `maxDelay`).

`failFastOnInitialSetupError` still short-circuits a deterministic
topology error on the first sight, budget notwithstanding.

Handoff caveat: after a successful validation the real recovering
connect runs — a broker dying inside that small window blocks per
amqplib's own initial loop.

Unset (default): behavior unchanged — amqplib's initial loop with the
shared `maxRetries` governs startup, and initial-window per-retry events
are not surfaced. Since 1.3.0.

amqplib ≥ 2.2.0 offers a native `initialMaxRetries`, but this option
stays the adapter's own loop: amqplib fires its per-attempt events
before `connect()` resolves — before the adapter's lifecycle wiring is
attached — and rejects with the raw last error on exhaustion.

***

### initialDelay?

> `readonly` `optional` **initialDelay?**: `number`

Defined in: [packages/events-amqp/src/types.ts:380](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L380)

#### Default

```ts
100
```

***

### jitter?

> `readonly` `optional` **jitter?**: `number`

Defined in: [packages/events-amqp/src/types.ts:386](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L386)

Symmetric jitter factor (0..1): the delay is uniform in `[base × (1 − jitter), base × (1 + jitter)]` around the capped base.

#### Default

```ts
0.2
```

***

### maxDelay?

> `readonly` `optional` **maxDelay?**: `number`

Defined in: [packages/events-amqp/src/types.ts:382](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L382)

Upper bound of every reconnect delay in ms: the base is capped at `maxDelay / (1 + jitter)`, so jitter never pushes a delay above it.

#### Default

```ts
30000
```

***

### maxRetries?

> `readonly` `optional` **maxRetries?**: `number`

Defined in: [packages/events-amqp/src/types.ts:388](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L388)

Attempts per series (initial connect and each recovery series); resets on success. To bound ONLY startup, use [initialConnectMaxRetries](#initialconnectmaxretries).

#### Default

```ts
Infinity
```
