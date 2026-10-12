[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [testing](../index.md) / FakeDeliveryResult

# Interface: FakeDeliveryResult

Defined in: [packages/events-amqp/src/testing.ts:130](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L130)

Settlement summary of one [FakeAmqpControl.deliver](FakeAmqpControl.md#deliver) call.

## Properties

### acked

> `readonly` **acked**: `number`

Defined in: [packages/events-amqp/src/testing.ts:134](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L134)

Handlers that called `ack()`.

***

### delivered

> `readonly` **delivered**: `number`

Defined in: [packages/events-amqp/src/testing.ts:132](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L132)

Handlers invoked (one per matching fan-out sub + one per distinct group).

***

### failed

> `readonly` **failed**: `number`

Defined in: [packages/events-amqp/src/testing.ts:140](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L140)

Handlers that rejected (swallowed, like the real consumer's nack-on-error path).

***

### nacked

> `readonly` **nacked**: `number`

Defined in: [packages/events-amqp/src/testing.ts:136](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L136)

Handlers that called `nack(false)`.

***

### requeued

> `readonly` **requeued**: `number`

Defined in: [packages/events-amqp/src/testing.ts:138](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L138)

Handlers that called `nack(true)` or a bare `nack()` — model redelivery by delivering again with `attempt + 1`.
