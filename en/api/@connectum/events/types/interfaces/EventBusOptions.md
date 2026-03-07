[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventBusOptions

# Interface: EventBusOptions

Defined in: [types.ts:240](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L240)

EventBus configuration options for createEventBus()

## Properties

### adapter

> **adapter**: [`EventAdapter`](EventAdapter.md)

Defined in: [types.ts:242](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L242)

Adapter instance (e.g., NatsAdapter, KafkaAdapter, MemoryAdapter)

***

### group?

> `optional` **group**: `string`

Defined in: [types.ts:246](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L246)

Consumer group name

***

### middleware?

> `optional` **middleware**: [`MiddlewareConfig`](MiddlewareConfig.md)

Defined in: [types.ts:248](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L248)

Middleware configuration

***

### routes?

> `optional` **routes**: [`EventRoute`](../type-aliases/EventRoute.md)[]

Defined in: [types.ts:244](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L244)

Event routes to register

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [types.ts:256](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L256)

Abort signal for graceful shutdown.

When provided, per-event signals are composed via `AbortSignal.any()`
so that server shutdown aborts in-flight event processing.
Automatically set when used with `createServer({ eventBus })`.
