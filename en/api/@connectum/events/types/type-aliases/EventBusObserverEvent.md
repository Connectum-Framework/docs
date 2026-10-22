[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventBusObserverEvent

# Type Alias: EventBusObserverEvent

> **EventBusObserverEvent** = \{ `handlers`: `number`; `publishes`: `number`; `type`: `"abandoned"`; \} \| \{ `topic`: `string`; `type`: `"admitted"`; \} \| \{ `reason`: `"aborted"` \| `"not-in-flight"`; `type`: `"rejected"`; \} \| \{ `topic`: `string`; `type`: `"dlq-republish"`; \}

Defined in: [packages/events/src/types.ts:360](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L360)

Work the shutdown of an [EventBus](../interfaces/EventBus.md) gave up on.

`abandoned` is reported once per `stop()`, only when something was left: `handlers` is the
number of handlers still running when `drainAbortGrace` ran out (all of them were aborted, none
returned), `publishes` the number of `publish()` calls still unsettled when `drainPublishTimeout`
ran out. The event reports work that was still unsettled when `stop()` abandoned it; it does not
say that a message was left unacknowledged (a handler may have acknowledged before it got stuck)
or that the broker will redeliver it.

## Union Members

### Type Literal

\{ `handlers`: `number`; `publishes`: `number`; `type`: `"abandoned"`; \}

***

### Type Literal

\{ `topic`: `string`; `type`: `"admitted"`; \}

A `ctx.publish` made while the bus was stopping was admitted.

***

### Type Literal

\{ `reason`: `"aborted"` \| `"not-in-flight"`; `type`: `"rejected"`; \}

A `ctx.publish` made while the bus was stopping was refused: `aborted` (the drain was
aborted), `not-in-flight` (its handler had already returned, or the context belongs to an
earlier start/stop cycle).

***

### Type Literal

\{ `topic`: `string`; `type`: `"dlq-republish"`; \}

The built-in dead-letter middleware republished a failed event while the bus was stopping.
