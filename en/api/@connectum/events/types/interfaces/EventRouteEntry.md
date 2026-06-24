[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventRouteEntry

# Interface: EventRouteEntry

Defined in: [packages/events/src/types.ts:212](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L212)

Registered event route (internal use)

## Properties

### handler

> `readonly` **handler**: [`TypedEventHandler`](../type-aliases/TypedEventHandler.md)\<`unknown`\>

Defined in: [packages/events/src/types.ts:218](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L218)

Typed handler function

***

### method

> `readonly` **method**: `DescMethod`

Defined in: [packages/events/src/types.ts:216](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L216)

Method descriptor for deserialization

***

### middleware?

> `readonly` `optional` **middleware?**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:220](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L220)

Per-handler middleware (overrides global when present)

***

### topic

> `readonly` **topic**: `string`

Defined in: [packages/events/src/types.ts:214](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L214)

Topic pattern to subscribe to
