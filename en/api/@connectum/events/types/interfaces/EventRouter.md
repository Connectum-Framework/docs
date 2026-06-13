[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventRouter

# Interface: EventRouter

Defined in: [packages/events/src/types.ts:214](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events/src/types.ts#L214)

Event router for registering service event handlers.

Mirrors ConnectRPC's ConnectRouter pattern:
`events.service(UserEventHandlers, { ... })` mirrors `router.service(UserService, { ... })`

## Methods

### service()

> **service**\<`S`\>(`serviceDesc`, `handlers`): `void`

Defined in: [packages/events/src/types.ts:216](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events/src/types.ts#L216)

Register event handlers for a service

#### Type Parameters

##### S

`S` *extends* `DescService`

#### Parameters

##### serviceDesc

`S`

##### handlers

[`ServiceEventHandlers`](../type-aliases/ServiceEventHandlers.md)\<`S`\>

#### Returns

`void`
