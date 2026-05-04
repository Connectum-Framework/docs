[Connectum API Reference](../../../index.md) / [@connectum/events-amqp](../index.md) / toAmqpPattern

# Function: toAmqpPattern()

> **toAmqpPattern**(`pattern`): `string`

Defined in: [AmqpAdapter.ts:35](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events-amqp/src/AmqpAdapter.ts#L35)

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
