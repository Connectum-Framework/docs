[Connectum API Reference](../../../index.md) / [@connectum/events-nats](../index.md) / NatsAdapter

# Function: NatsAdapter()

> **NatsAdapter**(`options`): `EventAdapter`

Defined in: [NatsAdapter.ts:70](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events-nats/src/NatsAdapter.ts#L70)

Create a NATS JetStream adapter.

## Parameters

### options

[`NatsAdapterOptions`](../types/interfaces/NatsAdapterOptions.md)

## Returns

`EventAdapter`

## Example

```typescript
import { NatsAdapter } from "@connectum/events-nats";
import { createEventBus } from "@connectum/events";

const adapter = NatsAdapter({ servers: "nats://localhost:4222" });
const bus = createEventBus({ adapter, routes: [myRoutes] });
await bus.start();
```
