[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ServiceDefinition

# Interface: ServiceDefinition

Defined in: [packages/core/src/defineService.ts:42](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/defineService.ts#L42)

A service ready to be mounted: its proto descriptor plus a `register` closure
that wires the handlers onto a `ConnectRouter`. Produced by [defineService](../functions/defineService.md)
and [defineLazyService](../functions/defineLazyService.md); consumed by `createServer({ services })`.

## Properties

### descriptor

> `readonly` **descriptor**: `DescService`

Defined in: [packages/core/src/defineService.ts:44](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/defineService.ts#L44)

The proto service descriptor (carries `typeName` and `file`).

***

### register

> `readonly` **register**: (`router`, `ctx`) => `void`

Defined in: [packages/core/src/defineService.ts:46](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/defineService.ts#L46)

**`Internal`**

Mounts the service's handlers on the given router.

#### Parameters

##### router

`ConnectRouter`

##### ctx

`RegisterContext`

#### Returns

`void`
