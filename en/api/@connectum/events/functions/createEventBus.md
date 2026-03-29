[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / createEventBus

# Function: createEventBus()

> **createEventBus**(`options`): [`EventBus`](../types/interfaces/EventBus.md) & `EventBusLike`

Defined in: [packages/events/src/EventBus.ts:71](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/EventBus.ts#L71)

Create an EventBus instance.

## Parameters

### options

[`EventBusOptions`](../types/interfaces/EventBusOptions.md)

EventBus configuration

## Returns

[`EventBus`](../types/interfaces/EventBus.md) & `EventBusLike`

EventBus instance implementing EventBusLike for server integration

## Example

```typescript
import { createEventBus, MemoryAdapter } from '@connectum/events';

const eventBus = createEventBus({
  adapter: MemoryAdapter(),
  routes: [myEventRoutes],
  middleware: {
    retry: { maxRetries: 3, backoff: 'exponential' },
    dlq: { topic: 'my-service.dlq' },
  },
});

await eventBus.start();
await eventBus.publish(UserCreatedSchema, { id: '1', email: 'a@b.c', name: 'Test' });
await eventBus.stop();
```
