[Connectum API Reference](../../../index.md) / [@connectum/events-amqp](../index.md) / toAmqpPattern

# Function: toAmqpPattern()

> **toAmqpPattern**(`pattern`): `string`

Defined in: [packages/events-amqp/src/AmqpAdapter.ts:53](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/events-amqp/src/AmqpAdapter.ts#L53)

Convert an EventBus wildcard pattern to an AMQP routing key pattern.

EventBus uses NATS-style wildcards:
- `*` matches a single token (same in AMQP topic exchange)
- `>` matches one or more tokens (AMQP uses `#`)

## Parameters

### pattern

`string`

EventBus wildcard pattern

## Returns

`string`

AMQP routing key pattern
