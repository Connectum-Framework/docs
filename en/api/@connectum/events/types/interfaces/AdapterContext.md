[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / AdapterContext

# Interface: AdapterContext

Defined in: [packages/events/src/types.ts:78](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events/src/types.ts#L78)

Context provided to adapters by the EventBus before connect().

Contains service-level information derived from registered proto
service descriptors. Adapters may use this for broker-level
identification (e.g., Kafka clientId, NATS connection name,
Redis connectionName).

## Properties

### serviceName?

> `readonly` `optional` **serviceName?**: `string`

Defined in: [packages/events/src/types.ts:88](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events/src/types.ts#L88)

Service identifier derived from proto service names.

Format: `{packageNames}@{hostname}`

Examples:
- `"order.v1@pod-abc123"` (single service)
- `"order.v1/payment.v1@pod-abc123"` (multiple services)
