[Connectum API Reference](../../../index.md) / [@connectum/events-kafka](../index.md) / KafkaAdapter

# Function: KafkaAdapter()

> **KafkaAdapter**(`options`): `EventAdapter`

Defined in: [KafkaAdapter.ts:122](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events-kafka/src/KafkaAdapter.ts#L122)

Create a Kafka/Redpanda adapter for @connectum/events.

## Parameters

### options

[`KafkaAdapterOptions`](../types/interfaces/KafkaAdapterOptions.md)

Kafka adapter configuration

## Returns

`EventAdapter`

EventAdapter instance

## Example

```typescript
import { KafkaAdapter } from "@connectum/events-kafka";

const adapter = KafkaAdapter({
    brokers: ["localhost:9092"],
    clientId: "my-service",
});

await adapter.connect();
await adapter.publish("user.created", payload);
await adapter.disconnect();
```
