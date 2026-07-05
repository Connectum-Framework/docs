[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpLifecycleEvent

# Type Alias: AmqpLifecycleEvent

> **AmqpLifecycleEvent** = \{ `reconnected`: `boolean`; `type`: `"connected"`; \} \| \{ `error`: `Error`; `type`: `"disconnected"`; \} \| \{ `attempt`: `number`; `delay`: `number`; `error`: `Error`; `type`: `"reconnecting"`; \} \| \{ `error`: `Error`; `type`: `"reconnect-failed"`; \} \| \{ `attempt`: `number`; `error`: `Error`; `initial`: `boolean`; `type`: `"setup-failed"`; \} \| \{ `reason`: `string`; `type`: `"blocked"`; \} \| \{ `type`: `"unblocked"`; \}

Defined in: [packages/events-amqp/src/types.ts:446](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L446)

Discriminated connection lifecycle event, delivered to
[AmqpLifecycleCallbacks.onLifecycle](../interfaces/AmqpLifecycleCallbacks.md#onlifecycle).

Exactly-once guarantees (pinned by integration tests):
- `connected` fires once per successful (re)connect; `reconnected` is `false`
  for the initial connect and `true` after a recovery.
- `disconnected` fires once per connection loss (a socket-level cut no longer
  double-fires via the raw `error` event — fixed in 1.3.0).
- `reconnecting` fires once per scheduled retry — after the connection has
  been established once, and also per attempt of the bounded initial phase
  when [AmqpRecoveryOptions.initialConnectMaxRetries](../interfaces/AmqpRecoveryOptions.md#initialconnectmaxretries) is set.
  `reconnect-failed` is terminal and fires for any of its three triggers:
  the retry budget is exhausted (`maxRetries`), the fatal topology policy
  stopped the cycle (`treatTopologyErrorAsFatal`), or the initial connect
  budget ran out (`initialConnectMaxRetries`).
- `setup-failed` reports a topology/setup failure with `initial: true` for
  the startup window (`attempt: 0` on the probe; the 0-based attempt index
  in the bounded initial phase) or `initial: false` for a reconnect
  re-assert (`attempt` >= 1).
- `blocked`/`unblocked` surface broker flow control (RabbitMQ
  `connection.blocked`, e.g. under a memory/disk alarm); they have no flat
  callback equivalent.

Scope: with amqplib's own initial loop (default), the retry loop of the
INITIAL connect (broker unreachable when `connect()` is called) happens
before the lifecycle wiring can attach, so its per-retry events are not
surfaced; the startup probe covers the deterministic-misconfiguration case
(`setup-failed { initial: true }`). Set
[AmqpRecoveryOptions.initialConnectMaxRetries](../interfaces/AmqpRecoveryOptions.md#initialconnectmaxretries) (since 1.3.0) to make
the adapter own that window — its bounded phase surfaces per-attempt
`reconnecting`/`setup-failed` events and a terminal `reconnect-failed` on
budget exhaustion.

The `type` values are deliberately broker-agnostic so a future
cross-adapter generalization stays non-breaking.
