[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ConnectumServiceImpl

# Type Alias: ConnectumServiceImpl\<Desc\>

> **ConnectumServiceImpl**\<`Desc`\> = `{ [P in keyof Desc["method"]]: ConnectumMethodImpl<Desc["method"][P]> }`

Defined in: [packages/core/src/context.ts:163](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/src/context.ts#L163)

The full implementation of a service: one [ConnectumMethodImpl](ConnectumMethodImpl.md) per
method. Accepted by [defineService](../functions/defineService.md) / [defineLazyService](../functions/defineLazyService.md).

Mirrors `@connectrpc/connect`'s `ServiceImpl` with the Connectum
[Context](../interfaces/Context.md).

## Type Parameters

### Desc

`Desc` *extends* `DescService`
