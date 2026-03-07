[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / ServiceEventHandlers

# Type Alias: ServiceEventHandlers\<S\>

> **ServiceEventHandlers**\<`S`\> = `{ [K in S["methods"][number] as K["localName"]]: TypedEventHandler<MessageShape<K["input"]>> }`

Defined in: [types.ts:149](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L149)

Maps service methods to typed event handlers.

Conditional type: for each method in the service descriptor,
creates a handler expecting the method's input type.

## Type Parameters

### S

`S` *extends* `DescService`
