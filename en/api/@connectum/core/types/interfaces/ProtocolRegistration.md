[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ProtocolRegistration

# Interface: ProtocolRegistration

Defined in: [packages/core/src/types.ts:84](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/core/src/types.ts#L84)

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

> `optional` **httpHandler**: [`HttpHandler`](../type-aliases/HttpHandler.md)

Defined in: [packages/core/src/types.ts:92](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/core/src/types.ts#L92)

Optional HTTP handler for fallback routing (e.g., /healthz endpoint)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/core/src/types.ts:86](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/core/src/types.ts#L86)

Protocol name for identification (e.g., "healthcheck", "reflection")

## Methods

### register()

> **register**(`router`, `context`): `void`

Defined in: [packages/core/src/types.ts:89](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/core/src/types.ts#L89)

Register protocol services on the router

#### Parameters

##### router

`ConnectRouter`

##### context

[`ProtocolContext`](ProtocolContext.md)

#### Returns

`void`
