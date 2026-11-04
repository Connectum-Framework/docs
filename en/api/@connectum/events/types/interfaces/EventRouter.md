[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventRouter

# Interface: EventRouter

Defined in: [packages/events/src/types.ts:273](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L273)

Event router for registering service event handlers.

Mirrors ConnectRPC's ConnectRouter pattern:
`events.service(UserEventHandlers, { ... })` mirrors `router.service(UserService, { ... })`

## Methods

### service()

> **service**\<`S`\>(`serviceDesc`, `handlers`): `void`

Defined in: [packages/events/src/types.ts:275](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L275)

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
