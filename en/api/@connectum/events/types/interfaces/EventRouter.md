[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventRouter

# Interface: EventRouter

Defined in: [packages/events/src/types.ts:216](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/types.ts#L216)

Event router for registering service event handlers.

Mirrors ConnectRPC's ConnectRouter pattern:
`events.service(UserEventHandlers, { ... })` mirrors `router.service(UserService, { ... })`

## Methods

### service()

> **service**\<`S`\>(`serviceDesc`, `handlers`): `void`

Defined in: [packages/events/src/types.ts:218](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/types.ts#L218)

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
