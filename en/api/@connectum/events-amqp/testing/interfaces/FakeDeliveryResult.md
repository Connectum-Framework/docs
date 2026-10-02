[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [testing](../index.md) / FakeDeliveryResult

# Interface: FakeDeliveryResult

Defined in: [packages/events-amqp/src/testing.ts:75](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L75)

Settlement summary of one [FakeAmqpControl.deliver](FakeAmqpControl.md#deliver) call.

## Properties

### acked

> `readonly` **acked**: `number`

Defined in: [packages/events-amqp/src/testing.ts:79](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L79)

Handlers that called `ack()`.

***

### delivered

> `readonly` **delivered**: `number`

Defined in: [packages/events-amqp/src/testing.ts:77](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L77)

Handlers invoked (one per matching fan-out sub + one per distinct group).

***

### failed

> `readonly` **failed**: `number`

Defined in: [packages/events-amqp/src/testing.ts:85](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L85)

Handlers that rejected (swallowed, like the real consumer's nack-on-error path).

***

### nacked

> `readonly` **nacked**: `number`

Defined in: [packages/events-amqp/src/testing.ts:81](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L81)

Handlers that called `nack(false)`.

***

### requeued

> `readonly` **requeued**: `number`

Defined in: [packages/events-amqp/src/testing.ts:83](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L83)

Handlers that called `nack(true)` — model redelivery by delivering again with `attempt + 1`.
