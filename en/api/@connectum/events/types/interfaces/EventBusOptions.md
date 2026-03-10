[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventBusOptions

# Interface: EventBusOptions

Defined in: [packages/events/src/types.ts:252](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L252)

EventBus configuration options for createEventBus()

## Properties

### adapter

> **adapter**: [`EventAdapter`](EventAdapter.md)

Defined in: [packages/events/src/types.ts:254](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L254)

Adapter instance (e.g., NatsAdapter, KafkaAdapter, MemoryAdapter)

***

### drainTimeout?

> `optional` **drainTimeout**: `number`

Defined in: [packages/events/src/types.ts:283](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L283)

Maximum time in milliseconds to wait for in-flight event handlers
to complete during shutdown. After this timeout, remaining handlers
are force-aborted via AbortSignal.

Default: 30000 (30 seconds). Set to 0 for immediate abort.

***

### group?

> `optional` **group**: `string`

Defined in: [packages/events/src/types.ts:258](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L258)

Consumer group name

***

### handlerTimeout?

> `optional` **handlerTimeout**: `number`

Defined in: [packages/events/src/types.ts:275](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L275)

Per-event handler timeout in milliseconds.

Each event handler invocation gets an AbortSignal that fires after
this duration. Default: 30000 (30 seconds).

***

### middleware?

> `optional` **middleware**: [`MiddlewareConfig`](MiddlewareConfig.md)

Defined in: [packages/events/src/types.ts:260](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L260)

Middleware configuration

***

### routes?

> `optional` **routes**: [`EventRoute`](../type-aliases/EventRoute.md)[]

Defined in: [packages/events/src/types.ts:256](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L256)

Event routes to register

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [packages/events/src/types.ts:268](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L268)

Abort signal for graceful shutdown.

When provided, per-event signals are composed via `AbortSignal.any()`
so that server shutdown aborts in-flight event processing.
Automatically set when used with `createServer({ eventBus })`.
