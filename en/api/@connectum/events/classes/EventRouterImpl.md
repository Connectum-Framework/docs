[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / EventRouterImpl

# Class: EventRouterImpl

Defined in: [packages/events/src/EventRouter.ts:17](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/events/src/EventRouter.ts#L17)

EventRouter implementation that collects route entries.

## Implements

- [`EventRouter`](../types/interfaces/EventRouter.md)

## Constructors

### Constructor

> **new EventRouterImpl**(): `EventRouterImpl`

#### Returns

`EventRouterImpl`

## Properties

### entries

> `readonly` **entries**: [`EventRouteEntry`](../types/interfaces/EventRouteEntry.md)[] = `[]`

Defined in: [packages/events/src/EventRouter.ts:18](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/events/src/EventRouter.ts#L18)

***

### serviceNames

> `readonly` **serviceNames**: `string`[] = `[]`

Defined in: [packages/events/src/EventRouter.ts:19](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/events/src/EventRouter.ts#L19)

## Methods

### service()

> **service**\<`S`\>(`serviceDesc`, `handlers`): `void`

Defined in: [packages/events/src/EventRouter.ts:21](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/events/src/EventRouter.ts#L21)

Register event handlers for a service

#### Type Parameters

##### S

`S` *extends* `DescService`

#### Parameters

##### serviceDesc

`S`

##### handlers

[`ServiceEventHandlers`](../types/type-aliases/ServiceEventHandlers.md)\<`S`\>

#### Returns

`void`

#### Implementation of

[`EventRouter`](../types/interfaces/EventRouter.md).[`service`](../types/interfaces/EventRouter.md#service)
