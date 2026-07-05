[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [testing](../index.md) / FakeDeliveryResult

# Interface: FakeDeliveryResult

Defined in: [packages/events-amqp/src/testing.ts:74](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L74)

Settlement summary of one [FakeAmqpControl.deliver](FakeAmqpControl.md#deliver) call.

## Properties

### acked

> `readonly` **acked**: `number`

Defined in: [packages/events-amqp/src/testing.ts:78](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L78)

Handlers that called `ack()`.

***

### delivered

> `readonly` **delivered**: `number`

Defined in: [packages/events-amqp/src/testing.ts:76](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L76)

Handlers invoked (one per matching fan-out sub + one per distinct group).

***

### failed

> `readonly` **failed**: `number`

Defined in: [packages/events-amqp/src/testing.ts:84](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L84)

Handlers that rejected (swallowed, like the real consumer's nack-on-error path).

***

### nacked

> `readonly` **nacked**: `number`

Defined in: [packages/events-amqp/src/testing.ts:80](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L80)

Handlers that called `nack(false)`.

***

### requeued

> `readonly` **requeued**: `number`

Defined in: [packages/events-amqp/src/testing.ts:82](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L82)

Handlers that called `nack(true)` — model redelivery by delivering again with `attempt + 1`.
