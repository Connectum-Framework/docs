[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / AdapterContext

# Interface: AdapterContext

Defined in: [packages/events/src/types.ts:80](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L80)

Context provided to adapters by the EventBus before connect().

Contains service-level information derived from registered proto
service descriptors. Adapters may use this for broker-level
identification (e.g., Kafka clientId, NATS connection name,
Redis connectionName).

## Properties

### serviceName?

> `readonly` `optional` **serviceName?**: `string`

Defined in: [packages/events/src/types.ts:90](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L90)

Service identifier derived from proto service names.

Format: `{packageNames}@{hostname}`

Examples:
- `"order.v1@pod-abc123"` (single service)
- `"order.v1/payment.v1@pod-abc123"` (multiple services)
