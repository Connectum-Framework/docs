[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ShutdownOptions

# Interface: ShutdownOptions

Defined in: [packages/core/src/types.ts:183](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/core/src/types.ts#L183)

Graceful shutdown options

## Properties

### autoShutdown?

> `optional` **autoShutdown**: `boolean`

Defined in: [packages/core/src/types.ts:200](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/core/src/types.ts#L200)

Enable automatic graceful shutdown on signals

#### Default

```ts
false
```

***

### forceCloseOnTimeout?

> `optional` **forceCloseOnTimeout**: `boolean`

Defined in: [packages/core/src/types.ts:208](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/core/src/types.ts#L208)

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

Defined in: [packages/core/src/types.ts:194](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/core/src/types.ts#L194)

Signals to listen for graceful shutdown

#### Default

```ts
["SIGTERM", "SIGINT"]
```

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/core/src/types.ts:188](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/core/src/types.ts#L188)

Timeout in milliseconds for graceful shutdown

#### Default

```ts
30000
```
