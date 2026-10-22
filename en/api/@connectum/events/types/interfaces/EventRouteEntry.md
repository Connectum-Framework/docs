[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventRouteEntry

# Interface: EventRouteEntry

Defined in: [packages/events/src/types.ts:252](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L252)

Registered event route (internal use)

## Properties

### handler

> `readonly` **handler**: [`TypedEventHandler`](../type-aliases/TypedEventHandler.md)\<`unknown`\>

Defined in: [packages/events/src/types.ts:258](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L258)

Typed handler function

***

### method

> `readonly` **method**: [`DescMethod`](https://protobufes.com/reference/reflection/descriptors/#types)

Defined in: [packages/events/src/types.ts:256](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L256)

Method descriptor for deserialization

***

### middleware?

> `readonly` `optional` **middleware?**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:260](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L260)

Per-handler middleware (overrides global when present)

***

### topic

> `readonly` **topic**: `string`

Defined in: [packages/events/src/types.ts:254](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L254)

Topic pattern to subscribe to
