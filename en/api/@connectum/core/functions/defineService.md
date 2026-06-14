[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / defineService

# Function: defineService()

> **defineService**\<`S`\>(`descriptor`, `handlers`): [`ServiceDefinition`](../interfaces/ServiceDefinition.md)

Defined in: [packages/core/src/defineService.ts:63](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/defineService.ts#L63)

Define a service from its descriptor and handler map.

## Type Parameters

### S

`S` *extends* `DescService`

## Parameters

### descriptor

`S`

### handlers

[`ConnectumServiceImpl`](../type-aliases/ConnectumServiceImpl.md)\<`S`\>

## Returns

[`ServiceDefinition`](../interfaces/ServiceDefinition.md)

## Example

```ts
const greeter = defineService(GreeterService, {
  async sayHello(req, ctx) {
    // ctx.call(...) is available for cross-service calls
    return { message: `Hello, ${req.name}!` };
  },
});
createServer({ services: [greeter] });
```
