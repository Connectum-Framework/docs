[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / defineLazyService

# Function: defineLazyService()

> **defineLazyService**\<`S`\>(`descriptor`, `factory`): [`ServiceDefinition`](../interfaces/ServiceDefinition.md)

Defined in: [packages/core/src/defineService.ts:80](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/defineService.ts#L80)

Define a service whose handlers (and their dependencies) are created lazily.

`factory` runs only when the service is actually mounted locally — i.e. when
it is in `enabledServices` (or `enabledServices` is `undefined`). A service
routed to a remote process never instantiates its local dependencies. Useful
for DI-heavy monoliths where wiring a service is expensive.

## Type Parameters

### S

`S` *extends* `DescService`

## Parameters

### descriptor

`S`

### factory

() => [`ConnectumServiceImpl`](../type-aliases/ConnectumServiceImpl.md)\<`S`\>

## Returns

[`ServiceDefinition`](../interfaces/ServiceDefinition.md)
