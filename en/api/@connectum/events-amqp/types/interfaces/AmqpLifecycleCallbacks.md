[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpLifecycleCallbacks

# Interface: AmqpLifecycleCallbacks

Defined in: [packages/events-amqp/src/types.ts:284](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L284)

Connection lifecycle callbacks.

## Properties

### onConnected?

> `readonly` `optional` **onConnected?**: () => `void`

Defined in: [packages/events-amqp/src/types.ts:285](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L285)

#### Returns

`void`

***

### onDisconnected?

> `readonly` `optional` **onDisconnected?**: (`cause`) => `void`

Defined in: [packages/events-amqp/src/types.ts:286](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L286)

#### Parameters

##### cause

`Error`

#### Returns

`void`

***

### onReconnectFailed?

> `readonly` `optional` **onReconnectFailed?**: (`cause`) => `void`

Defined in: [packages/events-amqp/src/types.ts:294](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L294)

#### Parameters

##### cause

`Error`

#### Returns

`void`

***

### onReconnecting?

> `readonly` `optional` **onReconnecting?**: (`info`) => `void`

Defined in: [packages/events-amqp/src/types.ts:293](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L293)

A reconnect attempt has been scheduled. Fires exactly ONCE per scheduled
retry (amqplib's `reconnect-scheduled`). A failed attempt that also emits
`connect-failed` does NOT double-invoke this; the terminal, retries-exhausted
case is reported via [onReconnectFailed](#onreconnectfailed), not here.

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

***

### onSetupFailed?

> `readonly` `optional` **onSetupFailed?**: (`error`, `ctx`) => `void`

Defined in: [packages/events-amqp/src/types.ts:307](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L307)

A setup/topology failure occurred while (re)applying the declarative
topology — on the initial connect's validation probe (`ctx.initial: true`,
`ctx.attempt: 0`) and/or on a reconnect whose topology re-assert fails
(`ctx.initial: false`, `ctx.attempt` ≥ 1).

This surfaces deterministic configuration drift (e.g. a missing queue in
`check` mode, or a `PRECONDITION_FAILED` redeclare) distinctly from a mere
broker outage, even when fail-fast is off. The initial-connect invocation
requires a startup validation probe, which runs when either this callback or
[AmqpAdapterOptions.failFastOnInitialSetupError](AmqpAdapterOptions.md#failfastoninitialsetuperror) is set.

#### Parameters

##### error

`Error`

##### ctx

###### attempt

`number`

###### initial

`boolean`

#### Returns

`void`
