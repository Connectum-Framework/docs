[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ShutdownOptions

# Interface: ShutdownOptions

Defined in: [packages/core/src/types.ts:184](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L184)

Graceful shutdown options

## Properties

### autoShutdown?

> `optional` **autoShutdown?**: `boolean`

Defined in: [packages/core/src/types.ts:201](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L201)

Enable automatic graceful shutdown on signals

#### Default

```ts
false
```

***

### forceCloseOnTimeout?

> `optional` **forceCloseOnTimeout?**: `boolean`

Defined in: [packages/core/src/types.ts:213](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L213)

Force close every client connection when the shutdown timeout is exceeded.
When true, all connections of every transport (HTTP/2 sessions, HTTP/1.1
and TLS sockets) are destroyed after the timeout, aborting requests still
in flight, so no client can keep the process alive. When false, nothing is
destroyed: `stop()` still resolves after the timeout and shutdown hooks
run, but open connections stay open and keep the process alive until
their clients close them.

#### Default

```ts
true
```

***

### signals?

> `optional` **signals?**: `Signals`[]

Defined in: [packages/core/src/types.ts:195](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L195)

Signals to listen for graceful shutdown

#### Default

```ts
["SIGTERM", "SIGINT"]
```

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [packages/core/src/types.ts:189](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L189)

Timeout in milliseconds for graceful shutdown

#### Default

```ts
30000
```
