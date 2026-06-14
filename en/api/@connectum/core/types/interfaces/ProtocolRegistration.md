[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ProtocolRegistration

# Interface: ProtocolRegistration

Defined in: [packages/core/src/types.ts:85](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/types.ts#L85)

Protocol registration interface

Protocols (healthcheck, reflection, custom) implement this interface
to register themselves on the server's ConnectRouter.

## Example

```typescript
const myProtocol: ProtocolRegistration = {
  name: "my-protocol",
  register(router, context) {
    router.service(MyService, myImpl);
  },
};

const server = createServer({
  services: [routes],
  protocols: [myProtocol],
});
```

## Properties

### httpHandler?

> `optional` **httpHandler?**: [`HttpHandler`](../type-aliases/HttpHandler.md)

Defined in: [packages/core/src/types.ts:93](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/types.ts#L93)

Optional HTTP handler for fallback routing (e.g., /healthz endpoint)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/core/src/types.ts:87](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/types.ts#L87)

Protocol name for identification (e.g., "healthcheck", "reflection")

## Methods

### register()

> **register**(`router`, `context`): `void`

Defined in: [packages/core/src/types.ts:90](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/types.ts#L90)

Register protocol services on the router

#### Parameters

##### router

`ConnectRouter`

##### context

[`ProtocolContext`](ProtocolContext.md)

#### Returns

`void`
