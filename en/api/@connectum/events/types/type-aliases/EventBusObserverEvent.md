[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventBusObserverEvent

# Type Alias: EventBusObserverEvent

> **EventBusObserverEvent** = \{ `handlers`: `number`; `publishes`: `number`; `type`: `"abandoned"`; \} \| \{ `topic`: `string`; `type`: `"admitted"`; \} \| \{ `reason`: `"aborted"` \| `"not-in-flight"`; `type`: `"rejected"`; \} \| \{ `topic`: `string`; `type`: `"dlq-republish"`; \} \| \{ `error`: `unknown`; `eventId`: `string`; `eventType`: `string`; `topic`: `string`; `type`: `"dlq-failed"`; \}

Defined in: [packages/events/src/types.ts:383](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L383)

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

***

### Type Literal

\{ `error`: `unknown`; `eventId`: `string`; `eventType`: `string`; `topic`: `string`; `type`: `"dlq-failed"`; \}

The built-in dead-letter middleware could not publish a failed event to its topic, at any
time, not only during a stop. The original is nacked without requeue and, unless the broker
has its own dead-letter policy, lost. `topic` is the dead-letter topic, `eventType` and
`eventId` identify the event, `error` is what the publish rejected with (it can carry broker
details, so redact it before logging it outside your service).
