[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventBusOptions

# Interface: EventBusOptions

Defined in: [packages/events/src/types.ts:294](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L294)

EventBus configuration options for createEventBus()

## Properties

### adapter

> **adapter**: [`EventAdapter`](EventAdapter.md)

Defined in: [packages/events/src/types.ts:296](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L296)

Adapter instance (e.g., NatsAdapter, KafkaAdapter, MemoryAdapter)

***

### drainTimeout?

> `optional` **drainTimeout?**: `number`

Defined in: [packages/events/src/types.ts:337](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L337)

Maximum time in milliseconds to wait for in-flight event handlers
to complete during shutdown. After this timeout, remaining handlers
are force-aborted via AbortSignal.

Default: 30000 (30 seconds). Set to 0 for immediate abort.

***

### group?

> `optional` **group?**: `string`

Defined in: [packages/events/src/types.ts:312](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L312)

Consumer group name

***

### handlerTimeout?

> `optional` **handlerTimeout?**: `number`

Defined in: [packages/events/src/types.ts:329](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L329)

Per-event handler timeout in milliseconds.

Each event handler invocation gets an AbortSignal that fires after
this duration. Default: 30000 (30 seconds).

***

### middleware?

> `optional` **middleware?**: [`MiddlewareConfig`](MiddlewareConfig.md)

Defined in: [packages/events/src/types.ts:314](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L314)

Middleware configuration

***

### publishes?

> `optional` **publishes?**: `DescService`[]

Defined in: [packages/events/src/types.ts:310](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L310)

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

Defined in: [packages/events/src/types.ts:298](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L298)

Event routes to register

***

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [packages/events/src/types.ts:322](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L322)

Abort signal for graceful shutdown.

When provided, per-event signals are composed via `AbortSignal.any()`
so that server shutdown aborts in-flight event processing.
Automatically set when used with `createServer({ eventBus })`.

***

### strictTopics?

> `optional` **strictTopics?**: `boolean`

Defined in: [packages/events/src/types.ts:351](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L351)

Reject a `publish()` whose topic cannot be resolved instead of silently
falling back to the message `typeName`.

By default, when no explicit `publishOptions.topic` is given and the event
type is covered by neither `routes` nor `publishes`, `publish()` emits to
the raw `schema.typeName` — a silent misconfiguration (the event may never
reach subscribers expecting the proto-declared `(event).topic`). With
`strictTopics: true`, that case throws so the misconfiguration surfaces at
the call site.

Default: `false` (backward-compatible silent fallback).
