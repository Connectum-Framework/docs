[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpRecoveryOptions

# Interface: AmqpRecoveryOptions

Defined in: [packages/events-amqp/src/types.ts:364](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L364)

Recovery knobs (passed through to amqplib's opt-in recovery).

`maxRetries` governs BOTH the initial connect and every subsequent recovery
series, with the counter reset on each success — so a finite value chosen only
to bound startup also caps steady-state recovery and makes the adapter brittle
(N consecutive transient failures in any single series stop it permanently).
The effective reconnect delay is symmetric jitter around the exponential
base — uniform in `[base × (1 − jitter), base × (1 + jitter)]` with
`base = min(maxDelay, initialDelay × factor^(attempt − 1))`. The cap applies
BEFORE jitter, so the wait can overshoot `maxDelay` (~20% at the default
jitter, up to ~2x at `jitter: 1`).

Full jitter with a hard cap is expressible today: set `jitter: 1` and halve
`initialDelay`/`maxDelay` — the delay becomes uniform in `[0, intended cap]`
(verified against amqplib 2.0.1's internal formula; re-verify on upgrades).

The initial connect CAN be bounded independently since 1.3.0 — see
[AmqpRecoveryOptions.initialConnectMaxRetries](#initialconnectmaxretries) (#198; upstream native
support tracked in [https://github.com/amqp-node/amqplib/issues/856](https://github.com/amqp-node/amqplib/issues/856)).
A pluggable backoff hook remains tracked in
[https://github.com/Connectum-Framework/connectum/issues/199](https://github.com/Connectum-Framework/connectum/issues/199)
(upstream: [https://github.com/amqp-node/amqplib/issues/855](https://github.com/amqp-node/amqplib/issues/855)).

## Properties

### factor?

> `readonly` `optional` **factor?**: `number`

Defined in: [packages/events-amqp/src/types.ts:370](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L370)

#### Default

```ts
2
```

***

### initialConnectMaxRetries?

> `readonly` `optional` **initialConnectMaxRetries?**: `number`

Defined in: [packages/events-amqp/src/types.ts:406](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L406)

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
silent block. Backoff matches amqplib's steady-state formula exactly
(same knobs above, same cap-before-jitter semantics).

`failFastOnInitialSetupError` still short-circuits a deterministic
topology error on the first sight, budget notwithstanding.

Handoff caveat: after a successful validation the real recovering
connect runs — a broker dying inside that small window blocks per
amqplib's own initial loop.

Unset (default): behavior unchanged — amqplib's initial loop with the
shared `maxRetries` governs startup, and initial-window per-retry events
are not surfaced. Since 1.3.0; upstream native support tracked in
[https://github.com/amqp-node/amqplib/issues/856](https://github.com/amqp-node/amqplib/issues/856).

***

### initialDelay?

> `readonly` `optional` **initialDelay?**: `number`

Defined in: [packages/events-amqp/src/types.ts:366](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L366)

#### Default

```ts
100
```

***

### jitter?

> `readonly` `optional` **jitter?**: `number`

Defined in: [packages/events-amqp/src/types.ts:372](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L372)

Symmetric jitter factor (0..1): the delay is uniform in `[base × (1 − jitter), base × (1 + jitter)]`.

#### Default

```ts
0.2
```

***

### maxDelay?

> `readonly` `optional` **maxDelay?**: `number`

Defined in: [packages/events-amqp/src/types.ts:368](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L368)

Base delay cap in ms; jitter is applied on top of the capped base, so the effective wait can exceed it.

#### Default

```ts
30000
```

***

### maxRetries?

> `readonly` `optional` **maxRetries?**: `number`

Defined in: [packages/events-amqp/src/types.ts:374](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L374)

Attempts per series (initial connect and each recovery series); resets on success. To bound ONLY startup, use [initialConnectMaxRetries](#initialconnectmaxretries).

#### Default

```ts
Infinity
```
