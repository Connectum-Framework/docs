[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ConnectumServiceImpl

# Type Alias: ConnectumServiceImpl\<Desc\>

> **ConnectumServiceImpl**\<`Desc`\> = `{ [P in keyof Desc["method"]]: ConnectumMethodImpl<Desc["method"][P]> }`

Defined in: [packages/core/src/context.ts:163](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/context.ts#L163)

The full implementation of a service: one [ConnectumMethodImpl](ConnectumMethodImpl.md) per
method. Accepted by [defineService](../functions/defineService.md) / [defineLazyService](../functions/defineLazyService.md).

Mirrors `@connectrpc/connect`'s `ServiceImpl` with the Connectum
[Context](../interfaces/Context.md).

## Type Parameters

### Desc

`Desc` *extends* `DescService`
