[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / defineService

# Function: defineService()

> **defineService**\<`S`\>(`descriptor`, `handlers`, `options?`): [`ServiceDefinition`](../interfaces/ServiceDefinition.md)

Defined in: [packages/core/src/defineService.ts:74](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/defineService.ts#L74)

Define a service from its descriptor and handler map.

Pass [ServiceOptions](../type-aliases/ServiceOptions.md) to set per-service handler options, e.g.
interceptors applied to every method of this service:

## Type Parameters

### S

`S` *extends* `DescService`

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
