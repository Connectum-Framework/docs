[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventRouteEntry

# Interface: EventRouteEntry

Defined in: [packages/events/src/types.ts:227](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L227)

Registered event route (internal use)

## Properties

### handler

> `readonly` **handler**: [`TypedEventHandler`](../type-aliases/TypedEventHandler.md)\<`unknown`\>

Defined in: [packages/events/src/types.ts:233](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L233)

Typed handler function

***

### method

> `readonly` **method**: `DescMethod`

Defined in: [packages/events/src/types.ts:231](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L231)

Method descriptor for deserialization

***

### middleware?

> `readonly` `optional` **middleware?**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:235](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L235)

Per-handler middleware (overrides global when present)

***

### topic

> `readonly` **topic**: `string`

Defined in: [packages/events/src/types.ts:229](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L229)

Topic pattern to subscribe to
