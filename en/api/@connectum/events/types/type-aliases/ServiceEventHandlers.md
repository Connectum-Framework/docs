[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / ServiceEventHandlers

# Type Alias: ServiceEventHandlers\<S\>

> **ServiceEventHandlers**\<`S`\> = `{ [K in S["methods"][number] as K["localName"]]: TypedEventHandler<MessageShape<K["input"]>> }`

Defined in: [packages/events/src/types.ts:177](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L177)

Maps service methods to typed event handlers.

Conditional type: for each method in the service descriptor,
creates a handler expecting the method's input type.

## Type Parameters

### S

`S` *extends* `DescService`
