[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [testing](../index.md) / FakeDeliveryResult

# Interface: FakeDeliveryResult

Defined in: [packages/events-amqp/src/testing.ts:96](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L96)

Settlement summary of one [FakeAmqpControl.deliver](FakeAmqpControl.md#deliver) call.

## Properties

### acked

> `readonly` **acked**: `number`

Defined in: [packages/events-amqp/src/testing.ts:100](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L100)

Handlers that called `ack()`.

***

### delivered

> `readonly` **delivered**: `number`

Defined in: [packages/events-amqp/src/testing.ts:98](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L98)

Handlers invoked (one per matching fan-out sub + one per distinct group).

***

### failed

> `readonly` **failed**: `number`

Defined in: [packages/events-amqp/src/testing.ts:106](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L106)

Handlers that rejected (swallowed, like the real consumer's nack-on-error path).

***

### nacked

> `readonly` **nacked**: `number`

Defined in: [packages/events-amqp/src/testing.ts:102](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L102)

Handlers that called `nack(false)`.

***

### requeued

> `readonly` **requeued**: `number`

Defined in: [packages/events-amqp/src/testing.ts:104](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L104)

Handlers that called `nack(true)` or a bare `nack()` — model redelivery by delivering again with `attempt + 1`.
