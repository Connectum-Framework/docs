[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / ServiceEventHandlers

# Type Alias: ServiceEventHandlers\<S\>

> **ServiceEventHandlers**\<`S`\> = `{ [K in S["methods"][number] as K["localName"]]: TypedEventHandler<MessageShape<K["input"]>> }`

Defined in: [packages/events/src/types.ts:150](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L150)

Maps service methods to typed event handlers.

Conditional type: for each method in the service descriptor,
creates a handler expecting the method's input type.

## Type Parameters

### S

`S` *extends* `DescService`
