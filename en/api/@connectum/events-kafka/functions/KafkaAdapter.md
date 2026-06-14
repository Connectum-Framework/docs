[Connectum API Reference](../../../index.md) / [@connectum/events-kafka](../index.md) / KafkaAdapter

# Function: KafkaAdapter()

> **KafkaAdapter**(`options`): `EventAdapter`

Defined in: [KafkaAdapter.ts:122](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events-kafka/src/KafkaAdapter.ts#L122)

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
