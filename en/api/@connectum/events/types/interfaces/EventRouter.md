[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventRouter

# Interface: EventRouter

Defined in: [packages/events/src/types.ts:216](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/events/src/types.ts#L216)

Event router for registering service event handlers.

Mirrors ConnectRPC's ConnectRouter pattern:
`events.service(UserEventHandlers, { ... })` mirrors `router.service(UserService, { ... })`

## Methods

### service()

> **service**\<`S`\>(`serviceDesc`, `handlers`): `void`

Defined in: [packages/events/src/types.ts:218](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/events/src/types.ts#L218)

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
