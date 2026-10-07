[Connectum API Reference](../../../index.md) / [@connectum/events-amqp](../index.md) / toAmqpPattern

# Function: toAmqpPattern()

> **toAmqpPattern**(`pattern`): `string`

Defined in: [packages/events-amqp/src/AmqpAdapter.ts:74](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/AmqpAdapter.ts#L74)

Convert an EventBus wildcard pattern to an AMQP routing key pattern.

EventBus uses complete dot-separated wildcard tokens. RabbitMQ's `*` matches
one topic segment and `#` matches zero or more; translating terminal `>` to
`*.#` preserves its one-or-more rule.
`subscribe()` requires a topic exchange for complete `*` or `>` tokens and
rejects a complete `#` segment on topic exchanges because RabbitMQ treats it
as a wildcard while EventBus treats it as literal text.

## Parameters

### pattern

`string`

EventBus wildcard pattern

## Returns

`string`

AMQP routing key pattern

## Throws

When a complete `>` segment is not terminal. The
  adapter's `subscribe()` method also rejects complete `*` or `>` tokens for
  non-topic exchanges and complete `#` tokens for topic exchanges before
  topology changes.
