[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ServerLogger

# Interface: ServerLogger

Defined in: [packages/core/src/types.ts:339](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L339)

Destination of the messages the server writes about its own lifecycle.

The global `console` satisfies this interface and is the default. Adapt a
logger whose methods take a different argument order (for example Pino's
`(object, message)`) with a small wrapper. Each method receives a complete
message first; failures pass the error object after it.

## Methods

### error()

> **error**(`message`, ...`details`): `void`

Defined in: [packages/core/src/types.ts:345](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L345)

A failure that has no other channel: an error thrown by a lifecycle listener, a failed graceful close.

#### Parameters

##### message

`string`

##### details

...`unknown`[]

#### Returns

`void`

***

### info()

> **info**(`message`, ...`details`): `void`

Defined in: [packages/core/src/types.ts:341](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L341)

A normal lifecycle event: the listening address, a received signal.

#### Parameters

##### message

`string`

##### details

...`unknown`[]

#### Returns

`void`

***

### warn()

> **warn**(`message`, ...`details`): `void`

Defined in: [packages/core/src/types.ts:343](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L343)

A condition that deserves attention but does not stop the server: a shutdown timeout, a transport misconfiguration, a shutdown hook that depends on a name nobody registered.

#### Parameters

##### message

`string`

##### details

...`unknown`[]

#### Returns

`void`
