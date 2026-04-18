[Connectum API Reference](../../../index.md) / [@connectum/events-nats](../index.md) / NatsAdapter

# Function: NatsAdapter()

> **NatsAdapter**(`options`): `EventAdapter`

Defined in: [NatsAdapter.ts:83](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/events-nats/src/NatsAdapter.ts#L83)

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
