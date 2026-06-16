[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpLifecycleCallbacks

# Interface: AmqpLifecycleCallbacks

Defined in: [packages/events-amqp/src/types.ts:223](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events-amqp/src/types.ts#L223)

Connection lifecycle callbacks.

## Properties

### onConnected?

> `readonly` `optional` **onConnected?**: () => `void`

Defined in: [packages/events-amqp/src/types.ts:224](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events-amqp/src/types.ts#L224)

#### Returns

`void`

***

### onDisconnected?

> `readonly` `optional` **onDisconnected?**: (`cause`) => `void`

Defined in: [packages/events-amqp/src/types.ts:225](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events-amqp/src/types.ts#L225)

#### Parameters

##### cause

`Error`

#### Returns

`void`

***

### onReconnectFailed?

> `readonly` `optional` **onReconnectFailed?**: (`cause`) => `void`

Defined in: [packages/events-amqp/src/types.ts:227](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events-amqp/src/types.ts#L227)

#### Parameters

##### cause

`Error`

#### Returns

`void`

***

### onReconnecting?

> `readonly` `optional` **onReconnecting?**: (`info`) => `void`

Defined in: [packages/events-amqp/src/types.ts:226](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events-amqp/src/types.ts#L226)

#### Parameters

##### info

###### attempt

`number`

###### delay

`number`

###### error

`Error`

#### Returns

`void`
