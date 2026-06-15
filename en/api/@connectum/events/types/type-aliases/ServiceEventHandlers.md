[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / ServiceEventHandlers

# Type Alias: ServiceEventHandlers\<S\>

> **ServiceEventHandlers**\<`S`\> = \{ \[K in keyof S\["method"\]\]: TypedEventHandler\<MessageShape\<S\["method"\]\[K\]\["input"\]\>\> \| EventHandlerConfig\<MessageShape\<S\["method"\]\[K\]\["input"\]\>\> \}

Defined in: [packages/events/src/types.ts:190](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/events/src/types.ts#L190)

Maps service methods to typed event handlers.

Each handler can be either:
- A simple function (uses global middleware)
- An object with `handler` and optional `middleware` (per-handler override)

## Type Parameters

### S

`S` *extends* `DescService`
