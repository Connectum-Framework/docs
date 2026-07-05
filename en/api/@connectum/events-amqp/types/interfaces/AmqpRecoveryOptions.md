[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpRecoveryOptions

# Interface: AmqpRecoveryOptions

Defined in: [packages/events-amqp/src/types.ts:311](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L311)

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

Bounding the initial connect independently from steady-state recovery, and a
pluggable backoff hook, are tracked as future options — see
[https://github.com/Connectum-Framework/connectum/issues/198](https://github.com/Connectum-Framework/connectum/issues/198) and
[https://github.com/Connectum-Framework/connectum/issues/199](https://github.com/Connectum-Framework/connectum/issues/199)
(upstream: [https://github.com/amqp-node/amqplib/issues/856](https://github.com/amqp-node/amqplib/issues/856) and
[https://github.com/amqp-node/amqplib/issues/855](https://github.com/amqp-node/amqplib/issues/855)).

## Properties

### factor?

> `readonly` `optional` **factor?**: `number`

Defined in: [packages/events-amqp/src/types.ts:317](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L317)

#### Default

```ts
2
```

***

### initialDelay?

> `readonly` `optional` **initialDelay?**: `number`

Defined in: [packages/events-amqp/src/types.ts:313](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L313)

#### Default

```ts
100
```

***

### jitter?

> `readonly` `optional` **jitter?**: `number`

Defined in: [packages/events-amqp/src/types.ts:319](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L319)

Symmetric jitter factor (0..1): the delay is uniform in `[base × (1 − jitter), base × (1 + jitter)]`.

#### Default

```ts
0.2
```

***

### maxDelay?

> `readonly` `optional` **maxDelay?**: `number`

Defined in: [packages/events-amqp/src/types.ts:315](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L315)

Base delay cap in ms; jitter is applied on top of the capped base, so the effective wait can exceed it.

#### Default

```ts
30000
```

***

### maxRetries?

> `readonly` `optional` **maxRetries?**: `number`

Defined in: [packages/events-amqp/src/types.ts:321](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L321)

Attempts per series (initial connect and each recovery series); resets on success.

#### Default

```ts
Infinity
```
