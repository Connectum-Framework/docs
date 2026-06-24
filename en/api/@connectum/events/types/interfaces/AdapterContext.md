[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / AdapterContext

# Interface: AdapterContext

Defined in: [packages/events/src/types.ts:93](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L93)

Context provided to adapters by the EventBus before connect().

Contains service-level information derived from registered proto
service descriptors. Adapters may use this for broker-level
identification (e.g., Kafka clientId, NATS connection name,
Redis connectionName).

## Properties

### serviceName?

> `readonly` `optional` **serviceName?**: `string`

Defined in: [packages/events/src/types.ts:103](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L103)

Service identifier derived from proto service names.

Format: `{packageNames}@{hostname}`

Examples:
- `"order.v1@pod-abc123"` (single service)
- `"order.v1/payment.v1@pod-abc123"` (multiple services)
