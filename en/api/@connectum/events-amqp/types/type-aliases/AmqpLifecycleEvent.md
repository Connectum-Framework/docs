[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpLifecycleEvent

# Type Alias: AmqpLifecycleEvent

> **AmqpLifecycleEvent** = \{ `reconnected`: `boolean`; `type`: `"connected"`; \} \| \{ `error`: `Error`; `type`: `"disconnected"`; \} \| \{ `attempt`: `number`; `delay`: `number`; `error`: `Error`; `type`: `"reconnecting"`; \} \| \{ `error`: `Error`; `type`: `"reconnect-failed"`; \} \| \{ `attempt`: `number`; `error`: `Error`; `initial`: `boolean`; `type`: `"setup-failed"`; \} \| \{ `reason`: `string`; `type`: `"blocked"`; \} \| \{ `type`: `"unblocked"`; \}

Defined in: [packages/events-amqp/src/types.ts:355](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L355)

Discriminated connection lifecycle event, delivered to
[AmqpLifecycleCallbacks.onLifecycle](../interfaces/AmqpLifecycleCallbacks.md#onlifecycle).

Exactly-once guarantees (pinned by integration tests):
- `connected` fires once per successful (re)connect; `reconnected` is `false`
  for the initial connect and `true` after a recovery.
- `disconnected` fires once per connection loss (a socket-level cut no longer
  double-fires via the raw `error` event — fixed in 1.3.0).
- `reconnecting` fires once per scheduled retry AFTER the connection has been
  established once. `reconnect-failed` is terminal and fires for either of
  its two triggers: the retry budget is exhausted (`maxRetries`), or the
  fatal topology policy stopped the cycle (`treatTopologyErrorAsFatal`).
- `setup-failed` reports a topology/setup failure on the initial validation
  probe (`initial: true`, `attempt: 0`) or a reconnect re-assert
  (`initial: false`, `attempt` >= 1).
- `blocked`/`unblocked` surface broker flow control (RabbitMQ
  `connection.blocked`, e.g. under a memory/disk alarm); they have no flat
  callback equivalent.

Scope: the retry loop of the INITIAL connect (broker unreachable when
`connect()` is called) happens before the lifecycle wiring can attach, so
its per-retry events are not surfaced; the startup probe covers the
deterministic-misconfiguration case (`setup-failed { initial: true }`).
Full initial-window observability lands with the adapter-owned bounded
initial phase — see
[https://github.com/Connectum-Framework/connectum/issues/198](https://github.com/Connectum-Framework/connectum/issues/198).

The `type` values are deliberately broker-agnostic so a future
cross-adapter generalization stays non-breaking.
