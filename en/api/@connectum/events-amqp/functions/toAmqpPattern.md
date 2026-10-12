[Connectum API Reference](../../../index.md) / [@connectum/events-amqp](../index.md) / toAmqpPattern

# Function: toAmqpPattern()

> **toAmqpPattern**(`pattern`): `string`

Defined in: [packages/events-amqp/src/AmqpAdapter.ts:75](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/AmqpAdapter.ts#L75)

Convert an EventBus wildcard pattern to an AMQP routing key pattern.

EventBus uses complete dot-separated wildcard tokens. RabbitMQ's `*` matches
one topic segment and `#` matches zero or more; translating terminal `>` to
`*.#` preserves its one-or-more rule.
The translation is meaningful on a topic exchange only. `subscribe()` also
rejects a complete `#` segment on topic exchanges (RabbitMQ treats it as a
wildcard while EventBus treats it as literal text) and a complete `*` or `>`
on a direct exchange when `topologyMode` is `"assert"` (the binding would be
a literal key that never matches); fanout and headers exchanges accept any
pattern because their queue receives every message.

## Parameters

### pattern

`string`

EventBus wildcard pattern

## Returns

`string`

AMQP routing key pattern

## Throws

When a complete `>` segment is not terminal.
