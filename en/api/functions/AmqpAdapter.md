[Connectum API Reference](../index.md) / AmqpAdapter

# Function: AmqpAdapter()

> **AmqpAdapter**(`options`): `EventAdapter`

Defined in: [AmqpAdapter.ts:77](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events-amqp/src/AmqpAdapter.ts#L77)

Create an AMQP/RabbitMQ adapter for @connectum/events.

## Parameters

### options

[`AmqpAdapterOptions`](../interfaces/AmqpAdapterOptions.md)

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
