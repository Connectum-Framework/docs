[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ProtocolRegistration

# Interface: ProtocolRegistration

Defined in: [packages/core/src/types.ts:107](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L107)

Protocol registration interface

Protocols (healthcheck, reflection, custom) implement this interface
to register themselves on the server's ConnectRouter.

A server builds more than one router from the same registration — one for
the HTTP adapter, one per in-process transport (`server.localClient`,
`ctx.call`). One-time work therefore belongs in `setup`, which runs once per
server, while `register` runs once per router and must only add routes.

A registration object belongs to one server. `setup` may keep per-server
state in it (the service list below, reflection's descriptor set), so the
same object passed to a second server is re-initialized by that server's
`setup`, and the first server's later routers serve the second server's
data. Call the protocol factory once per server.

## Example

```typescript
function myProtocol(): ProtocolRegistration {
  let serviceNames: string[] = [];
  return {
    name: "my-protocol",
    setup(context) {
      serviceNames = context.registry.flatMap((file) => file.services.map((s) => s.typeName));
    },
    register(router) {
      router.service(MyService, { list: () => ({ services: serviceNames }) });
    },
  };
}

const server = createServer({
  services: [routes],
  protocols: [myProtocol()],
});
```

## Properties

### httpHandler?

> `optional` **httpHandler?**: [`HttpHandler`](../type-aliases/HttpHandler.md)

Defined in: [packages/core/src/types.ts:128](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L128)

Optional HTTP handler for fallback routing (e.g., /healthz endpoint)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/core/src/types.ts:109](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L109)

Protocol name for identification (e.g., "healthcheck", "reflection")

## Methods

### register()

> **register**(`router`): `void`

Defined in: [packages/core/src/types.ts:125](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L125)

Register protocol services on the router. Called once for every router
the server builds (HTTP adapter and each in-process transport), so it
must only add routes and must not change state observable elsewhere.

#### Parameters

##### router

`ConnectRouter`

#### Returns

`void`

***

### setup()?

> `optional` **setup**(`context`): `void`

Defined in: [packages/core/src/types.ts:118](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L118)

One-time initialization, called exactly once per server immediately
before this protocol's first [ProtocolRegistration.register](#register).
The place for anything that reads the registry or has side effects.

If route materialization fails, the next attempt calls `setup` again.

#### Parameters

##### context

[`ProtocolContext`](ProtocolContext.md)

#### Returns

`void`
