[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventRouter

# Interface: EventRouter

Defined in: [packages/events/src/types.ts:172](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L172)

Event router for registering service event handlers.

Mirrors ConnectRPC's ConnectRouter pattern:
`events.service(UserEventHandlers, { ... })` mirrors `router.service(UserService, { ... })`

## Methods

### service()

> **service**\<`S`\>(`serviceDesc`, `handlers`): `void`

Defined in: [packages/events/src/types.ts:174](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L174)

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
