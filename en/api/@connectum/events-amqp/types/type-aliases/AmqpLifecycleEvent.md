[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpLifecycleEvent

# Type Alias: AmqpLifecycleEvent

> **AmqpLifecycleEvent** = \{ `reconnected`: `boolean`; `type`: `"connected"`; \} \| \{ `error`: `Error`; `type`: `"disconnected"`; \} \| \{ `attempt`: `number`; `delay`: `number`; `error`: `Error`; `type`: `"reconnecting"`; \} \| \{ `error`: `Error`; `type`: `"reconnect-failed"`; \} \| \{ `attempt`: `number`; `error`: `Error`; `initial`: `boolean`; `type`: `"setup-failed"`; \} \| \{ `reason`: `string`; `type`: `"blocked"`; \} \| \{ `type`: `"unblocked"`; \} \| \{ `action`: [`AmqpSettlementAction`](AmqpSettlementAction.md); `deliveryTag`: `number`; `error`: `Error`; `queue`: `string`; `routingKey`: `string`; `type`: `"settlement-skipped"`; \} \| \{ `callback`: `string`; `error`: `Error`; `event`: `string`; `type`: `"lifecycle-error"`; \}

Defined in: [packages/events-amqp/src/types.ts:508](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L508)

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
  budget ran out (`initialConnectMaxRetries`). Once it fires, the adapter
  has already dropped the dead connection and its subscriptions:
  `publish()` and `subscribe()` reject with `AmqpConnectionError`
  ("not connected"), and a new `connect()` starts from a clean state —
  re-subscribe explicitly.
- `setup-failed` reports a topology/setup failure with `initial: true` for
  the startup window (`attempt: 0` on the probe; the 0-based attempt index
  in the bounded initial phase) or `initial: false` for a reconnect
  re-assert (`attempt` >= 1).
- `blocked`/`unblocked` surface broker flow control (RabbitMQ
  `connection.blocked`, e.g. under a memory/disk alarm); they have no flat
  callback equivalent.
- `settlement-skipped` reports an acknowledge, requeue or reject that the
  adapter skipped because the consumer channel was already closed. It is a
  diagnostic, not a failure: the broker requeues every delivery that was not
  acknowledged before the channel closed, so the message is redelivered. On a
  quorum queue each such return counts toward the queue's delivery limit
  (default 20 since RabbitMQ 4.0); past it the broker drops the message or
  dead-letters it. Union-only (no flat callback).
- `lifecycle-error` reports a lifecycle callback that threw or returned a
  promise that rejected. The failure is already isolated; the event only
  makes it visible. A failure while handling a `lifecycle-error` is dropped.
  Union-only (no flat callback).

Disconnect cause: `disconnected.error` is the error amqplib reports for the
close with `recovery` enabled and disabled alike (so a broker-forced close
exposes its reply `code`); only a close that carries no cause at all gets a
synthetic `Error("Connection closed")`.

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

## Union Members

### Type Literal

\{ `reconnected`: `boolean`; `type`: `"connected"`; \}

***

### Type Literal

\{ `error`: `Error`; `type`: `"disconnected"`; \}

***

### Type Literal

\{ `attempt`: `number`; `delay`: `number`; `error`: `Error`; `type`: `"reconnecting"`; \}

***

### Type Literal

\{ `error`: `Error`; `type`: `"reconnect-failed"`; \}

***

### Type Literal

\{ `attempt`: `number`; `error`: `Error`; `initial`: `boolean`; `type`: `"setup-failed"`; \}

***

### Type Literal

\{ `reason`: `string`; `type`: `"blocked"`; \}

***

### Type Literal

\{ `type`: `"unblocked"`; \}

***

### Type Literal

\{ `action`: [`AmqpSettlementAction`](AmqpSettlementAction.md); `deliveryTag`: `number`; `error`: `Error`; `queue`: `string`; `routingKey`: `string`; `type`: `"settlement-skipped"`; \}

***

### Type Literal

\{ `callback`: `string`; `error`: `Error`; `event`: `string`; `type`: `"lifecycle-error"`; \}

#### callback

> `readonly` **callback**: `string`

Name of the callback that failed: `onLifecycle` or a flat callback such as `onReconnecting`.

#### error

> `readonly` **error**: `Error`

#### event

> `readonly` **event**: `string`

`type` of the event that callback was handling.

#### type

> `readonly` **type**: `"lifecycle-error"`
