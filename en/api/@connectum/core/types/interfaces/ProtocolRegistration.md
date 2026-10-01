[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ProtocolRegistration

# Interface: ProtocolRegistration

Defined in: [packages/core/src/types.ts:119](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L119)

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
      serviceNames = context.services.map((s) => s.typeName);
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

Defined in: [packages/core/src/types.ts:146](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L146)

Optional HTTP handler for fallback routing (e.g., /healthz endpoint)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/core/src/types.ts:121](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L121)

Protocol name for identification (e.g., "healthcheck", "reflection")

## Methods

### register()

> **register**(`router`): `void`

Defined in: [packages/core/src/types.ts:143](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L143)

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

Defined in: [packages/core/src/types.ts:136](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L136)

Initialization: called while the server's routes are materialized,
immediately before this protocol's first
[ProtocolRegistration.register](#register). Routers built after that (one per
in-process transport) call `register` again for their own routes and
reuse whatever `setup` prepared; they do not call `setup`. The place for
anything that reads the registry or has side effects.

If the initial route materialization fails, the next attempt calls
`setup` again, so any side effects it has run again too. Keep them
idempotent, or undo them when a later step of the same materialization
fails. A failure on a router built after that does not call `setup`.

#### Parameters

##### context

[`ProtocolContext`](ProtocolContext.md)

#### Returns

`void`
