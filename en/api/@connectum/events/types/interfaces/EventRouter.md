[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventRouter

# Interface: EventRouter

Defined in: [packages/events/src/types.ts:269](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L269)

Event router for registering service event handlers.

Mirrors ConnectRPC's ConnectRouter pattern:
`events.service(UserEventHandlers, { ... })` mirrors `router.service(UserService, { ... })`

## Methods

### service()

> **service**\<`S`\>(`serviceDesc`, `handlers`): `void`

Defined in: [packages/events/src/types.ts:271](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L271)

Register event handlers for a service

#### Type Parameters

##### S

`S` *extends* [`DescService`](https://protobufes.com/reference/reflection/descriptors/#types)

#### Parameters

##### serviceDesc

`S`

##### handlers

[`ServiceEventHandlers`](../type-aliases/ServiceEventHandlers.md)\<`S`\>

#### Returns

`void`
