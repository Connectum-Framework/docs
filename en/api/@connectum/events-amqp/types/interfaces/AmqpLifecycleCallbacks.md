[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpLifecycleCallbacks

# Interface: AmqpLifecycleCallbacks

Defined in: [packages/events-amqp/src/types.ts:636](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L636)

Connection lifecycle callbacks.

Prefer the single discriminated [onLifecycle](#onlifecycle) callback; the flat
callbacks are a compatibility shim over the same event stream and are
deprecated since 1.3.0 (removal not before 2.0).

## Properties

### ~~onConnected?~~

> `readonly` `optional` **onConnected?**: () => `void`

Defined in: [packages/events-amqp/src/types.ts:660](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L660)

#### Returns

`void`

#### Deprecated

Since 1.3.0 — use [onLifecycle](#onlifecycle) (`type: "connected"`). Kept until at least 2.0.

***

### ~~onDisconnected?~~

> `readonly` `optional` **onDisconnected?**: (`cause`) => `void`

Defined in: [packages/events-amqp/src/types.ts:662](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L662)

#### Parameters

##### cause

`Error`

#### Returns

`void`

#### Deprecated

Since 1.3.0 — use [onLifecycle](#onlifecycle) (`type: "disconnected"`). Kept until at least 2.0.

***

### onLifecycle?

> `readonly` `optional` **onLifecycle?**: (`event`) => `void`

Defined in: [packages/events-amqp/src/types.ts:658](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L658)

Single discriminated-union lifecycle callback — the preferred surface.
Receives every [AmqpLifecycleEvent](../type-aliases/AmqpLifecycleEvent.md), including `blocked`/`unblocked`,
which have no flat-callback equivalent. Flat callbacks (if also set) are
invoked after `onLifecycle` for the same underlying event.

Should not throw: dispatch runs inside the connection driver's event
handlers, so a thrown exception or a rejected returned promise is
isolated to protect the connection — it neither disturbs recovery nor
starves the flat shim, and it is reported as a `lifecycle-error` event.
The adapter does NOT await a returned promise: events are dispatched in
order, but a slow async callback may finish after later events.

Setting this (like `onSetupFailed` / `failFastOnInitialSetupError`)
enables the startup validation probe: one extra short-lived connection
plus a topology validation pass at `connect()` (requires recovery
enabled), so `setup-failed { initial: true }` can be delivered for a
deterministic misconfiguration at boot. With
[AmqpRecoveryOptions.initialConnectMaxRetries](AmqpRecoveryOptions.md#initialconnectmaxretries) no probe runs: the
initial attempts themselves report their setup failures.

#### Parameters

##### event

[`AmqpLifecycleEvent`](../type-aliases/AmqpLifecycleEvent.md)

#### Returns

`void`

***

### ~~onReconnectFailed?~~

> `readonly` `optional` **onReconnectFailed?**: (`cause`) => `void`

Defined in: [packages/events-amqp/src/types.ts:675](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L675)

#### Parameters

##### cause

`Error`

#### Returns

`void`

#### Deprecated

Since 1.3.0 — use [onLifecycle](#onlifecycle) (`type: "reconnect-failed"`). Kept until at least 2.0.

***

### ~~onReconnecting?~~

> `readonly` `optional` **onReconnecting?**: (`info`) => `void`

Defined in: [packages/events-amqp/src/types.ts:673](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L673)

A reconnect attempt has been scheduled. Fires exactly ONCE per scheduled
retry (amqplib's `reconnect-scheduled`). A failed attempt that also emits
`connect-failed` does NOT double-invoke this; the terminal case (retry
budget exhausted, or a fatal topology stop under
`treatTopologyErrorAsFatal`) is reported via [onReconnectFailed](#onreconnectfailed),
not here.

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

#### Deprecated

Since 1.3.0 — use [onLifecycle](#onlifecycle) (`type: "reconnecting"`). Kept until at least 2.0.

***

### ~~onSetupFailed?~~

> `readonly` `optional` **onSetupFailed?**: (`error`, `ctx`) => `void`

Defined in: [packages/events-amqp/src/types.ts:692](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L692)

A setup/topology failure occurred while (re)applying the declarative
topology — during the startup window (`ctx.initial: true`; `ctx.attempt`
is 0 on the probe, or the 0-based index of the failed attempt under
`initialConnectMaxRetries`) and/or on a reconnect whose topology
re-assert fails (`ctx.initial: false`, `ctx.attempt` ≥ 1).

This surfaces deterministic configuration drift (e.g. a missing queue in
`check` mode, or a `PRECONDITION_FAILED` redeclare) distinctly from a mere
broker outage, even when fail-fast is off. Without
`initialConnectMaxRetries`, the initial-connect invocation requires a
startup validation probe, which runs when either this callback,
[onLifecycle](#onlifecycle), or [AmqpAdapterOptions.failFastOnInitialSetupError](AmqpAdapterOptions.md#failfastoninitialsetuperror) is set.

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

#### Deprecated

Since 1.3.0 — use [onLifecycle](#onlifecycle) (`type: "setup-failed"`). Kept until at least 2.0.
