[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpConsumerLossCause

# Type Alias: AmqpConsumerLossCause

> **AmqpConsumerLossCause** = `"cancelled"` \| `"channel-closed"`

Defined in: [packages/events-amqp/src/types.ts:651](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L651)

How the broker ended a consumer: cancelled it (e.g. queue deleted) or closed its channel with an exception.
