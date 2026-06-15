[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ServiceDefinition

# Interface: ServiceDefinition

Defined in: [packages/core/src/defineService.ts:50](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/defineService.ts#L50)

A service ready to be mounted: its proto descriptor plus a `register` closure
that wires the handlers onto a `ConnectRouter`. Produced by [defineService](../functions/defineService.md)
and [defineLazyService](../functions/defineLazyService.md); consumed by `createServer({ services })`.

## Properties

### descriptor

> `readonly` **descriptor**: `DescService`

Defined in: [packages/core/src/defineService.ts:52](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/defineService.ts#L52)

The proto service descriptor (carries `typeName` and `file`).

***

### register

> `readonly` **register**: (`router`, `ctx`) => `void`

Defined in: [packages/core/src/defineService.ts:54](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/defineService.ts#L54)

**`Internal`**

Mounts the service's handlers on the given router.

#### Parameters

##### router

`ConnectRouter`

##### ctx

`RegisterContext`

#### Returns

`void`
