[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventRouteEntry

# Interface: EventRouteEntry

Defined in: [packages/events/src/types.ts:256](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L256)

Registered event route (internal use)

## Properties

### handler

> `readonly` **handler**: [`TypedEventHandler`](../type-aliases/TypedEventHandler.md)\<`unknown`\>

Defined in: [packages/events/src/types.ts:262](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L262)

Typed handler function

***

### method

> `readonly` **method**: [`DescMethod`](https://protobufes.com/reference/reflection/descriptors/#types)

Defined in: [packages/events/src/types.ts:260](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L260)

Method descriptor for deserialization

***

### middleware?

> `readonly` `optional` **middleware?**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:264](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L264)

Per-handler middleware (overrides global when present)

***

### topic

> `readonly` **topic**: `string`

Defined in: [packages/events/src/types.ts:258](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L258)

Topic pattern to subscribe to
