[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventRouteEntry

# Interface: EventRouteEntry

Defined in: [packages/events/src/types.ts:197](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events/src/types.ts#L197)

Registered event route (internal use)

## Properties

### handler

> `readonly` **handler**: [`TypedEventHandler`](../type-aliases/TypedEventHandler.md)\<`unknown`\>

Defined in: [packages/events/src/types.ts:203](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events/src/types.ts#L203)

Typed handler function

***

### method

> `readonly` **method**: `DescMethod`

Defined in: [packages/events/src/types.ts:201](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events/src/types.ts#L201)

Method descriptor for deserialization

***

### middleware?

> `readonly` `optional` **middleware?**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:205](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events/src/types.ts#L205)

Per-handler middleware (overrides global when present)

***

### topic

> `readonly` **topic**: `string`

Defined in: [packages/events/src/types.ts:199](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events/src/types.ts#L199)

Topic pattern to subscribe to
