[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventBusOptions

# Interface: EventBusOptions

Defined in: [packages/events/src/types.ts:324](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L324)

EventBus configuration options for createEventBus()

## Properties

### adapter

> **adapter**: [`EventAdapter`](EventAdapter.md)

Defined in: [packages/events/src/types.ts:326](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L326)

Adapter instance (e.g., NatsAdapter, KafkaAdapter, MemoryAdapter)

***

### drainPublishTimeout?

> `optional` **drainPublishTimeout?**: `number`

Defined in: [packages/events/src/types.ts:394](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L394)

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
by the stopping gate (the relay-pattern design is tracked in
https://github.com/Connectum-Framework/connectum/issues/212).

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

Defined in: [packages/events/src/types.ts:367](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L367)

Maximum time in milliseconds to wait for in-flight event handlers
to complete during shutdown. After this timeout, remaining handlers
are force-aborted via AbortSignal.

Default: 30000 (30 seconds). Set to 0 for immediate abort.

***

### group?

> `optional` **group?**: `string`

Defined in: [packages/events/src/types.ts:342](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L342)

Consumer group name

***

### handlerTimeout?

> `optional` **handlerTimeout?**: `number`

Defined in: [packages/events/src/types.ts:359](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L359)

Per-event handler timeout in milliseconds.

Each event handler invocation gets an AbortSignal that fires after
this duration. Default: 30000 (30 seconds).

***

### middleware?

> `optional` **middleware?**: [`MiddlewareConfig`](MiddlewareConfig.md)

Defined in: [packages/events/src/types.ts:344](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L344)

Middleware configuration

***

### publishes?

> `optional` **publishes?**: `DescService`[]

Defined in: [packages/events/src/types.ts:340](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L340)

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

Defined in: [packages/events/src/types.ts:328](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L328)

Event routes to register

***

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [packages/events/src/types.ts:352](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L352)

Abort signal for graceful shutdown.

When provided, per-event signals are composed via `AbortSignal.any()`
so that server shutdown aborts in-flight event processing.
Automatically set when used with `createServer({ eventBus })`.

***

### strictTopics?

> `optional` **strictTopics?**: `boolean`

Defined in: [packages/events/src/types.ts:408](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L408)

Reject a `publish()` whose topic cannot be resolved instead of silently
falling back to the message `typeName`.

By default, when no explicit `publishOptions.topic` is given and the event
type is covered by neither `routes` nor `publishes`, `publish()` emits to
the raw `schema.typeName` — a silent misconfiguration (the event may never
reach subscribers expecting the proto-declared `(event).topic`). With
`strictTopics: true`, that case throws so the misconfiguration surfaces at
the call site.

Default: `false` (backward-compatible silent fallback).
