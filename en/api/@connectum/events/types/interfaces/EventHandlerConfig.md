[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventHandlerConfig

# Interface: EventHandlerConfig\<I\>

Defined in: [packages/events/src/types.ts:178](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/types.ts#L178)

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

Defined in: [packages/events/src/types.ts:180](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/types.ts#L180)

Event handler function

***

### middleware?

> `readonly` `optional` **middleware?**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:182](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/types.ts#L182)

Per-handler middleware array (overrides global middleware for this handler)
