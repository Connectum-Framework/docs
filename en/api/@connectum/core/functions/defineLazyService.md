[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / defineLazyService

# Function: defineLazyService()

> **defineLazyService**\<`S`\>(`descriptor`, `factory`, `options?`): [`ServiceDefinition`](../interfaces/ServiceDefinition.md)

Defined in: [packages/core/src/defineService.ts:95](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/defineService.ts#L95)

Define a service whose handlers (and their dependencies) are created lazily.

`factory` runs only when the service is actually mounted locally — i.e. when
it is in `enabledServices` (or `enabledServices` is `undefined`). A service
routed to a remote process never instantiates its local dependencies. Useful
for DI-heavy monoliths where wiring a service is expensive.

`factory` runs once per server: the HTTP adapter, `server.localClient` and
`ctx.call` all reach the same instance. The same definition mounted on two
servers yields one instance per server.

## Type Parameters

### S

`S` *extends* `DescService`

## Parameters

### descriptor

`S`

### factory

() => [`ConnectumServiceImpl`](../type-aliases/ConnectumServiceImpl.md)\<`S`\>

### options?

`Partial`\<`UniversalHandlerOptions`\>

## Returns

[`ServiceDefinition`](../interfaces/ServiceDefinition.md)
