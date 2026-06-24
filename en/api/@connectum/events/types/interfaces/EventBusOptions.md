[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventBusOptions

# Interface: EventBusOptions

Defined in: [packages/events/src/types.ts:309](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L309)

EventBus configuration options for createEventBus()

## Properties

### adapter

> **adapter**: [`EventAdapter`](EventAdapter.md)

Defined in: [packages/events/src/types.ts:311](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L311)

Adapter instance (e.g., NatsAdapter, KafkaAdapter, MemoryAdapter)

***

### drainTimeout?

> `optional` **drainTimeout?**: `number`

Defined in: [packages/events/src/types.ts:352](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L352)

Maximum time in milliseconds to wait for in-flight event handlers
to complete during shutdown. After this timeout, remaining handlers
are force-aborted via AbortSignal.

Default: 30000 (30 seconds). Set to 0 for immediate abort.

***

### group?

> `optional` **group?**: `string`

Defined in: [packages/events/src/types.ts:327](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L327)

Consumer group name

***

### handlerTimeout?

> `optional` **handlerTimeout?**: `number`

Defined in: [packages/events/src/types.ts:344](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L344)

Per-event handler timeout in milliseconds.

Each event handler invocation gets an AbortSignal that fires after
this duration. Default: 30000 (30 seconds).

***

### middleware?

> `optional` **middleware?**: [`MiddlewareConfig`](MiddlewareConfig.md)

Defined in: [packages/events/src/types.ts:329](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L329)

Middleware configuration

***

### publishes?

> `optional` **publishes?**: `DescService`[]

Defined in: [packages/events/src/types.ts:325](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L325)

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

Defined in: [packages/events/src/types.ts:313](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L313)

Event routes to register

***

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [packages/events/src/types.ts:337](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L337)

Abort signal for graceful shutdown.

When provided, per-event signals are composed via `AbortSignal.any()`
so that server shutdown aborts in-flight event processing.
Automatically set when used with `createServer({ eventBus })`.

***

### strictTopics?

> `optional` **strictTopics?**: `boolean`

Defined in: [packages/events/src/types.ts:366](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L366)

Reject a `publish()` whose topic cannot be resolved instead of silently
falling back to the message `typeName`.

By default, when no explicit `publishOptions.topic` is given and the event
type is covered by neither `routes` nor `publishes`, `publish()` emits to
the raw `schema.typeName` — a silent misconfiguration (the event may never
reach subscribers expecting the proto-declared `(event).topic`). With
`strictTopics: true`, that case throws so the misconfiguration surfaces at
the call site.

Default: `false` (backward-compatible silent fallback).
