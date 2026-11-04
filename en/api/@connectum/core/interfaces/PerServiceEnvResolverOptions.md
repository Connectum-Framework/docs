[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / PerServiceEnvResolverOptions

# Interface: PerServiceEnvResolverOptions

Defined in: [packages/core/src/remoteResolver.ts:119](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/remoteResolver.ts#L119)

Options for [perServiceEnvResolver](../functions/perServiceEnvResolver.md).

## Properties

### createTransport?

> `readonly` `optional` **createTransport?**: (`baseUrl`) => `Transport`

Defined in: [packages/core/src/remoteResolver.ts:121](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/remoteResolver.ts#L121)

Build a `Transport` from the resolved base URL. Defaults to a gRPC (HTTP/2) transport.

#### Parameters

##### baseUrl

`string`

#### Returns

`Transport`
