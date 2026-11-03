[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ShutdownOptions

# Interface: ShutdownOptions

Defined in: [packages/core/src/types.ts:278](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L278)

Graceful shutdown options

## Properties

### autoShutdown?

> `optional` **autoShutdown?**: `boolean`

Defined in: [packages/core/src/types.ts:305](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L305)

Enable automatic graceful shutdown on signals. Must be a boolean. The
handlers are installed when `start()` begins, so a signal that arrives
while the server is still starting stops it as soon as the start has
finished.

A signal received again while the server is stopping ends the process at
once, in the middle of the shutdown hooks, after a warning in the log: it is
the way out of a shutdown that hangs. If the application or another server
has its own `process.on` listener for the signal, the process is not terminated (a `process.once` listener that has already run is not counted).

#### Default

```ts
false
```

***

### forceCloseOnTimeout?

> `optional` **forceCloseOnTimeout?**: `boolean`

Defined in: [packages/core/src/types.ts:328](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L328)

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
does not bound. A hook that never settles therefore keeps `stop()` pending
for good; when the timeout has elapsed and hooks are still running, the
server logs one warning through its `logger` naming them and the elapsed
time, and keeps waiting. It rejects if a shutdown hook fails or the transport fails
to close before the timeout; a close failure after the timeout is only
logged.

#### Default

```ts
true
```

***

### signals?

> `optional` **signals?**: `Signals`[]

Defined in: [packages/core/src/types.ts:291](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L291)

Signals to listen for graceful shutdown: a non-empty array of signal names the
platform knows (`SIGKILL` and `SIGSTOP` cannot be handled). `createServer()`
throws for anything else, also while `autoShutdown` is off.

#### Default

```ts
["SIGTERM", "SIGINT"]
```

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [packages/core/src/types.ts:283](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L283)

Timeout in milliseconds for graceful shutdown

#### Default

```ts
30000
```
