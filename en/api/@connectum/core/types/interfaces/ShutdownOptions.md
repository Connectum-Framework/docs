[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ShutdownOptions

# Interface: ShutdownOptions

Defined in: [packages/core/src/types.ts:184](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/types.ts#L184)

Graceful shutdown options

## Properties

### autoShutdown?

> `optional` **autoShutdown?**: `boolean`

Defined in: [packages/core/src/types.ts:201](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/types.ts#L201)

Enable automatic graceful shutdown on signals

#### Default

```ts
false
```

***

### forceCloseOnTimeout?

> `optional` **forceCloseOnTimeout?**: `boolean`

Defined in: [packages/core/src/types.ts:209](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/types.ts#L209)

Force close all HTTP/2 sessions when shutdown timeout is exceeded.
When true, sessions are destroyed after timeout. When false, server
waits indefinitely for in-flight requests to complete.

#### Default

```ts
true
```

***

### signals?

> `optional` **signals?**: `Signals`[]

Defined in: [packages/core/src/types.ts:195](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/types.ts#L195)

Signals to listen for graceful shutdown

#### Default

```ts
["SIGTERM", "SIGINT"]
```

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [packages/core/src/types.ts:189](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/types.ts#L189)

Timeout in milliseconds for graceful shutdown

#### Default

```ts
30000
```
