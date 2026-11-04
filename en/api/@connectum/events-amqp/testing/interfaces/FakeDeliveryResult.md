[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [testing](../index.md) / FakeDeliveryResult

# Interface: FakeDeliveryResult

Defined in: [packages/events-amqp/src/testing.ts:131](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L131)

Settlement summary of one [FakeAmqpControl.deliver](FakeAmqpControl.md#deliver) call.

## Properties

### acked

> `readonly` **acked**: `number`

Defined in: [packages/events-amqp/src/testing.ts:135](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L135)

Handlers that called `ack()`.

***

### delivered

> `readonly` **delivered**: `number`

Defined in: [packages/events-amqp/src/testing.ts:133](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L133)

Handlers invoked (one per matching fan-out sub + one per distinct group).

***

### failed

> `readonly` **failed**: `number`

Defined in: [packages/events-amqp/src/testing.ts:141](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L141)

Handlers that rejected (swallowed, like the real consumer's nack-on-error path).

***

### nacked

> `readonly` **nacked**: `number`

Defined in: [packages/events-amqp/src/testing.ts:137](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L137)

Handlers that called `nack(false)`.

***

### requeued

> `readonly` **requeued**: `number`

Defined in: [packages/events-amqp/src/testing.ts:139](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L139)

Handlers that called `nack(true)` or a bare `nack()` — model redelivery by delivering again with `attempt + 1`.
