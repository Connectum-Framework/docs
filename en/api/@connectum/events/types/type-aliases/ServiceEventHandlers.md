[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / ServiceEventHandlers

# Type Alias: ServiceEventHandlers\<S\>

> **ServiceEventHandlers**\<`S`\> = \{ \[K in keyof S\["method"\]\]: TypedEventHandler\<MessageShape\<S\["method"\]\[K\]\["input"\]\>\> \| EventHandlerConfig\<MessageShape\<S\["method"\]\[K\]\["input"\]\>\> \}

Defined in: [packages/events/src/types.ts:205](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L205)

Maps service methods to typed event handlers.

Each handler can be either:
- A simple function (uses global middleware)
- An object with `handler` and optional `middleware` (per-handler override)

## Type Parameters

### S

`S` *extends* `DescService`
