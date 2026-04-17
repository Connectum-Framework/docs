[Connectum API Reference](../index.md) / toAmqpPattern

# Function: toAmqpPattern()

> **toAmqpPattern**(`pattern`): `string`

Defined in: [AmqpAdapter.ts:35](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-amqp/src/AmqpAdapter.ts#L35)

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
