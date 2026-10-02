[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ServiceDefinition

# Interface: ServiceDefinition

Defined in: [packages/core/src/defineService.ts:50](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/defineService.ts#L50)

A service ready to be mounted: its proto descriptor plus a `register` closure
that wires the handlers onto a `ConnectRouter`. Produced by [defineService](../functions/defineService.md)
and [defineLazyService](../functions/defineLazyService.md); consumed by `createServer({ services })`.

## Properties

### descriptor

> `readonly` **descriptor**: [`DescService`](https://protobufes.com/reference/reflection/descriptors/#types)

Defined in: [packages/core/src/defineService.ts:52](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/defineService.ts#L52)

The proto service descriptor (carries `typeName` and `file`).
