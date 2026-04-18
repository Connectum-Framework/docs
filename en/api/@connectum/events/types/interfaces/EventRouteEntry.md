[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventRouteEntry

# Interface: EventRouteEntry

Defined in: [packages/events/src/types.ts:199](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/events/src/types.ts#L199)

Registered event route (internal use)

## Properties

### handler

> `readonly` **handler**: [`TypedEventHandler`](../type-aliases/TypedEventHandler.md)\<`unknown`\>

Defined in: [packages/events/src/types.ts:205](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/events/src/types.ts#L205)

Typed handler function

***

### method

> `readonly` **method**: `DescMethod`

Defined in: [packages/events/src/types.ts:203](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/events/src/types.ts#L203)

Method descriptor for deserialization

***

### middleware?

> `readonly` `optional` **middleware?**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:207](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/events/src/types.ts#L207)

Per-handler middleware (overrides global when present)

***

### topic

> `readonly` **topic**: `string`

Defined in: [packages/events/src/types.ts:201](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/events/src/types.ts#L201)

Topic pattern to subscribe to
