[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventRouteEntry

# Interface: EventRouteEntry

Defined in: [types.ts:156](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L156)

Registered event route (internal use)

## Properties

### handler

> `readonly` **handler**: [`TypedEventHandler`](../type-aliases/TypedEventHandler.md)\<`unknown`\>

Defined in: [types.ts:162](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L162)

Typed handler function

***

### method

> `readonly` **method**: `DescMethod`

Defined in: [types.ts:160](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L160)

Method descriptor for deserialization

***

### topic

> `readonly` **topic**: `string`

Defined in: [types.ts:158](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L158)

Topic pattern to subscribe to
