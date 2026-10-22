[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventBusOptions

# Interface: EventBusOptions

Defined in: [packages/events/src/types.ts:383](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L383)

EventBus configuration options for createEventBus()

## Properties

### adapter

> **adapter**: [`EventAdapter`](EventAdapter.md)

Defined in: [packages/events/src/types.ts:385](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L385)

Adapter instance (e.g., NatsAdapter, KafkaAdapter, MemoryAdapter)

***

### drainAbortGrace?

> `optional` **drainAbortGrace?**: `number`

Defined in: [packages/events/src/types.ts:455](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L455)

Maximum time in milliseconds `stop()` keeps waiting for handlers that are still running
AFTER `drainTimeout` expired and they were force-aborted. A handler that ignores the abort
signal is then abandoned: `stop()` goes on to disconnect the adapter without waiting for
the adapter to close the subscription of a handler that is still running, and the observer
is told (`abandoned`). The abandoned handler's later acknowledgement may fail (the
adapter contract does not say); whether its message is delivered again is up to the
broker and to whether the handler had already acknowledged it.

Total shutdown budget of the bus: `drainTimeout` + `drainAbortGrace` (the handler phase;
the publish drain runs concurrently with it), plus whatever the transport phase of
`createServer`'s `shutdown.timeout` took before. Compare the sum with the kill grace period
of your orchestrator.

Default: `undefined` — the wait after the abort has no limit, as before: a handler that
never returns holds `stop()` forever. There is no default number because the time handlers
need to finish after an abort has not been measured. `0` abandons at once after the abort.
Must be a finite, non-negative number; anything else (negative, `NaN`, `Infinity`) throws a
`RangeError` from `createEventBus`; leave it unset for an unbounded wait.

***

### drainPublishTimeout?

> `optional` **drainPublishTimeout?**: `number`

Defined in: [packages/events/src/types.ts:488](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L488)

Opt-in symmetric publish drain during `stop()`: maximum time in
milliseconds to wait for in-flight `publish()` promises (started BEFORE
`stop()` was called) to settle, before the adapter is disconnected.

Runs concurrently with the handler drain (`drainTimeout`) — shutdown
waits for the slower of the two, not their sum. Tracked promises carry
a no-op observer, so a publish that settles (even rejects) after the
deadline never becomes an `unhandledRejection`; the caller's own
`publish()` promise is unaffected (rejections still propagate to it).

NOT covered: publishes issued from inside handlers (including the DLQ
republish) — those are governed by the handler drain and its post-abort
settle window; new `publish()` calls after `stop()` begins are rejected
by the stopping gate; handler-originated publishes are covered only by
the handler drain and its post-abort settlement window.

Budget note: `createServer`'s `shutdown.timeout` bounds the transport
phase, not the shutdown hooks that stop the bus — a large value here
extends total process shutdown accordingly; size it below your
orchestrator's kill grace period.

Default: `undefined` — disabled: `stop()` behavior is unchanged and
in-flight publishes race the adapter disconnect exactly as before.
`0` (or negative) also disables waiting. Available since 1.3.0.

***

### drainTimeout?

> `optional` **drainTimeout?**: `number`

Defined in: [packages/events/src/types.ts:434](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L434)

Maximum time in milliseconds to wait for in-flight event handlers
to complete during shutdown. After this timeout, remaining handlers
are force-aborted via AbortSignal.

Default: 30000 (30 seconds). Set to 0 for immediate abort.

***

### group?

> `optional` **group?**: `string`

Defined in: [packages/events/src/types.ts:409](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L409)

Consumer group name, passed to every subscription of this bus.

When omitted, the adapter picks a new random group per subscription. With
Kafka that group (`connectum-<uuid>`) has no committed offset and
`consumerOptions.fromBeginning` is `false` by default, so after a restart the
events published during the downtime are not delivered. Set an explicit
`group` for a subscription that must not lose them.

***

### handlerTimeout?

> `optional` **handlerTimeout?**: `number`

Defined in: [packages/events/src/types.ts:426](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L426)

Per-event handler timeout in milliseconds.

Each event handler invocation gets an AbortSignal that fires after
this duration. Default: 30000 (30 seconds).

***

### middleware?

> `optional` **middleware?**: [`MiddlewareConfig`](MiddlewareConfig.md)

Defined in: [packages/events/src/types.ts:411](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L411)

Middleware configuration

***

### observer?

> `optional` **observer?**: [`EventBusObserver`](../type-aliases/EventBusObserver.md)

Defined in: [packages/events/src/types.ts:461](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L461)

Receives what the shutdown could not finish, see [EventBusObserverEvent](../type-aliases/EventBusObserverEvent.md). Called
synchronously by `stop()`; an error thrown by it (or a promise it returns that rejects)
is swallowed, because reporting must never prevent the adapter from being disconnected.

***

### publishes?

> `optional` **publishes?**: [`DescService`](https://protobufes.com/reference/reflection/descriptors/#types)[]

Defined in: [packages/events/src/types.ts:399](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L399)

Event service descriptors this bus publishes to (publish-only, no subscription).

A process that only PUBLISHES events has no `routes`, so its publish-topic
lookup would be empty and `publish()` would fall back to the message
`typeName` — silently emitting to the wrong topic whenever the event
declares a custom `(connectum.events.v1.event).topic`. List the event
service descriptors here to populate the publish-topic lookup from their
proto options, so the declared topic is used end-to-end without
hand-maintaining raw topic strings. Subscribers still register via `routes`.

***

### routes?

> `optional` **routes?**: [`EventRoute`](../type-aliases/EventRoute.md)[]

Defined in: [packages/events/src/types.ts:387](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L387)

Event routes to register

***

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [packages/events/src/types.ts:419](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L419)

Abort signal for graceful shutdown.

When provided, per-event signals are composed via `AbortSignal.any()`
so that server shutdown aborts in-flight event processing.
Automatically set when used with `createServer({ eventBus })`.

***

### strictTopics?

> `optional` **strictTopics?**: `boolean`

Defined in: [packages/events/src/types.ts:502](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L502)

Reject a `publish()` whose topic cannot be resolved instead of silently
falling back to the message `typeName`.

By default, when no explicit `publishOptions.topic` is given and the event
type is covered by neither `routes` nor `publishes`, `publish()` emits to
the raw `schema.typeName` — a silent misconfiguration (the event may never
reach subscribers expecting the proto-declared `(event).topic`). With
`strictTopics: true`, that case throws so the misconfiguration surfaces at
the call site.

Default: `false` (backward-compatible silent fallback).
