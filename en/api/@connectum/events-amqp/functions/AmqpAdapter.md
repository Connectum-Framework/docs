[Connectum API Reference](../../../index.md) / [@connectum/events-amqp](../index.md) / AmqpAdapter

# Function: AmqpAdapter()

> **AmqpAdapter**(`options`): `EventAdapter`

Defined in: [packages/events-amqp/src/AmqpAdapter.ts:152](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/events-amqp/src/AmqpAdapter.ts#L152)

Create an AMQP/RabbitMQ adapter for @connectum/events.

## Parameters

### options

[`AmqpAdapterOptions`](../types/interfaces/AmqpAdapterOptions.md)

AMQP adapter configuration

## Returns

`EventAdapter`

EventAdapter instance

## Examples

```typescript
import { AmqpAdapter } from "@connectum/events-amqp";
import { createEventBus } from "@connectum/events";

const bus = createEventBus({
    adapter: AmqpAdapter({ url: "amqp://guest:guest@localhost:5672" }),
    routes: [myRoutes],
});
await bus.start();
```

**External AMQP contract (AsyncAPI-style)**

```typescript
const adapter = AmqpAdapter({
    url: "amqp://broker:5672",
    exchange: "partner.direct",
    exchangeType: "direct",
    serialization: { contentType: "application/json" },
    topology: {
        queues: [{
            name: "partner.inbound.v1",
            durable: true,
            arguments: {
                "x-dead-letter-exchange": "partner.dlx",
                "x-dead-letter-routing-key": "inbound.dead",
            },
        }],
        bindings: [{ queue: "partner.inbound.v1", source: "partner.direct", routingKey: "inbound" }],
    },
    queueOverrides: { partner: { queue: "partner.inbound.v1" } },
    publisherOptions: { persistent: true, mandatory: true },
});
```
