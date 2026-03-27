[Connectum API Reference](../index.md) / toAmqpPattern

# Function: toAmqpPattern()

> **toAmqpPattern**(`pattern`): `string`

Defined in: [AmqpAdapter.ts:35](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events-amqp/src/AmqpAdapter.ts#L35)

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
