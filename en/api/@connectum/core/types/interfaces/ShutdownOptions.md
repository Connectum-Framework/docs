[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ShutdownOptions

# Interface: ShutdownOptions

Defined in: [packages/core/src/types.ts:161](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/core/src/types.ts#L161)

Graceful shutdown options

## Properties

### autoShutdown?

> `optional` **autoShutdown**: `boolean`

Defined in: [packages/core/src/types.ts:178](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/core/src/types.ts#L178)

Enable automatic graceful shutdown on signals

#### Default

```ts
false
```

***

### forceCloseOnTimeout?

> `optional` **forceCloseOnTimeout**: `boolean`

Defined in: [packages/core/src/types.ts:186](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/core/src/types.ts#L186)

Force close all HTTP/2 sessions when shutdown timeout is exceeded.
When true, sessions are destroyed after timeout. When false, server
waits indefinitely for in-flight requests to complete.

#### Default

```ts
true
```

***

### signals?

> `optional` **signals**: `Signals`[]

Defined in: [packages/core/src/types.ts:172](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/core/src/types.ts#L172)

Signals to listen for graceful shutdown

#### Default

```ts
["SIGTERM", "SIGINT"]
```

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/core/src/types.ts:166](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/core/src/types.ts#L166)

Timeout in milliseconds for graceful shutdown

#### Default

```ts
30000
```
