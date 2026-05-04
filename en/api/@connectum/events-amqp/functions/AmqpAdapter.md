[Connectum API Reference](../../../index.md) / [@connectum/events-amqp](../index.md) / AmqpAdapter

# Function: AmqpAdapter()

> **AmqpAdapter**(`options`): `EventAdapter`

Defined in: [AmqpAdapter.ts:77](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events-amqp/src/AmqpAdapter.ts#L77)

Create an AMQP/RabbitMQ adapter for @connectum/events.

## Parameters

### options

[`AmqpAdapterOptions`](../types/interfaces/AmqpAdapterOptions.md)

AMQP adapter configuration

## Returns

`EventAdapter`

EventAdapter instance

## Example

```typescript
import { AmqpAdapter } from "@connectum/events-amqp";
import { createEventBus } from "@connectum/events";

const bus = createEventBus({
    adapter: AmqpAdapter({ url: "amqp://guest:guest@localhost:5672" }),
    routes: [myRoutes],
});
await bus.start();
```
