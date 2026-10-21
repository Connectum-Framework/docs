[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventHandlerConfig

# Interface: EventHandlerConfig\<I\>

Defined in: [packages/events/src/types.ts:214](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L214)

Per-handler middleware configuration.

Overrides global EventBus middleware for this specific handler.
When present, the global middleware pipeline is bypassed entirely
and only the per-handler middleware array is applied.

## Type Parameters

### I

`I`

## Properties

### handler

> `readonly` **handler**: [`TypedEventHandler`](../type-aliases/TypedEventHandler.md)\<`I`\>

Defined in: [packages/events/src/types.ts:216](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L216)

Event handler function

***

### middleware?

> `readonly` `optional` **middleware?**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:218](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L218)

Per-handler middleware array (overrides global middleware for this handler)
