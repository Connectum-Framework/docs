[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / defineService

# Function: defineService()

> **defineService**\<`S`\>(`descriptor`, `handlers`, `options?`): [`ServiceDefinition`](../interfaces/ServiceDefinition.md)

Defined in: [packages/core/src/defineService.ts:81](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/defineService.ts#L81)

Define a service from its descriptor and handler map.

`handlers` must be an object whose present members are functions (a method
left out answers `unimplemented`); anything else throws a `TypeError` naming
the service. Two definitions for one service type name are rejected by
`createServer()` and `addService()`.

Pass [ServiceOptions](../type-aliases/ServiceOptions.md) to set per-service handler options, e.g.
interceptors applied to every method of this service:

## Type Parameters

### S

`S` *extends* [`DescService`](https://protobufes.com/reference/reflection/descriptors/#types)

## Parameters

### descriptor

`S`

### handlers

[`ConnectumServiceImpl`](../type-aliases/ConnectumServiceImpl.md)\<`S`\>

### options?

`Partial`\<`UniversalHandlerOptions`\>

## Returns

[`ServiceDefinition`](../interfaces/ServiceDefinition.md)

## Example

```ts
const greeter = defineService(GreeterService, {
  async sayHello(req, ctx) {
    // ctx.call(...) is available for cross-service calls
    return { message: `Hello, ${req.name}!` };
  },
}, { interceptors: [requireAuth, auditLog] });
createServer({ services: [greeter] });
```
