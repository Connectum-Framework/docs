[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventRouteEntry

# Interface: EventRouteEntry

Defined in: [packages/events/src/types.ts:235](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L235)

Registered event route (internal use)

## Properties

### handler

> `readonly` **handler**: [`TypedEventHandler`](../type-aliases/TypedEventHandler.md)\<`unknown`\>

Defined in: [packages/events/src/types.ts:241](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L241)

Typed handler function

***

### method

> `readonly` **method**: [`DescMethod`](https://protobufes.com/reference/reflection/descriptors/#types)

Defined in: [packages/events/src/types.ts:239](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L239)

Method descriptor for deserialization

***

### middleware?

> `readonly` `optional` **middleware?**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:243](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L243)

Per-handler middleware (overrides global when present)

***

### topic

> `readonly` **topic**: `string`

Defined in: [packages/events/src/types.ts:237](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L237)

Topic pattern to subscribe to
