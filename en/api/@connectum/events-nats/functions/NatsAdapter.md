[Connectum API Reference](../../../index.md) / [@connectum/events-nats](../index.md) / NatsAdapter

# Function: NatsAdapter()

> **NatsAdapter**(`options`): `EventAdapter`

Defined in: [NatsAdapter.ts:83](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-nats/src/NatsAdapter.ts#L83)

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
