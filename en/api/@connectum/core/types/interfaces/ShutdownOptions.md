[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ShutdownOptions

# Interface: ShutdownOptions

Defined in: [packages/core/src/types.ts:239](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L239)

Graceful shutdown options

## Properties

### autoShutdown?

> `optional` **autoShutdown?**: `boolean`

Defined in: [packages/core/src/types.ts:256](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L256)

Enable automatic graceful shutdown on signals

#### Default

```ts
false
```

***

### forceCloseOnTimeout?

> `optional` **forceCloseOnTimeout?**: `boolean`

Defined in: [packages/core/src/types.ts:276](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L276)

Force close every client connection when the shutdown timeout is exceeded.
When true, all connections of every transport (HTTP/2 sessions, HTTP/1.1
and TLS sockets) are destroyed after the timeout, aborting requests still
in flight, so no client connection can keep the process alive; other
resources (timers, broker or database connections) still can. Release
them in your shutdown hooks; `stop()` runs the hooks but does not verify
that they released anything. When false, nothing is destroyed: shutdown
continues after the timeout and hooks run, but open connections stay open
and keep the process alive until their clients close them.

With either value `stop()` does not wait for client connections beyond
the timeout, but it does wait for the shutdown hooks, which the timeout
does not bound. It rejects if a shutdown hook fails or the transport fails
to close before the timeout; a close failure after the timeout is only
logged.

#### Default

```ts
true
```

***

### signals?

> `optional` **signals?**: `Signals`[]

Defined in: [packages/core/src/types.ts:250](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L250)

Signals to listen for graceful shutdown

#### Default

```ts
["SIGTERM", "SIGINT"]
```

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [packages/core/src/types.ts:244](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L244)

Timeout in milliseconds for graceful shutdown

#### Default

```ts
30000
```
