[Connectum API Reference](../../../index.md) / [@connectum/events-redis](../index.md) / RedisAdapter

# Function: RedisAdapter()

> **RedisAdapter**(`options?`): `EventAdapter`

Defined in: [RedisAdapter.ts:68](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events-redis/src/RedisAdapter.ts#L68)

Create a Redis Streams adapter for the Connectum event bus.

The adapter uses Redis Streams with consumer groups for durable,
load-balanced event consumption. Each subscription creates a
dedicated blocking connection (via `redis.duplicate()`) to avoid
blocking the main connection used for publishing.

## Parameters

### options?

[`RedisAdapterOptions`](../types/interfaces/RedisAdapterOptions.md) = `{}`

## Returns

`EventAdapter`

## Example

```typescript
import { createEventBus } from "@connectum/events";
import { RedisAdapter } from "@connectum/events-redis";

const bus = createEventBus({
    adapter: RedisAdapter({ url: "redis://localhost:6379" }),
    routes: [myEventRoutes],
});

await bus.start();
```
