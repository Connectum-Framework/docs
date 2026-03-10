[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / EventRouterImpl

# Class: EventRouterImpl

Defined in: [packages/events/src/EventRouter.ts:17](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/EventRouter.ts#L17)

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

Defined in: [packages/events/src/EventRouter.ts:18](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/EventRouter.ts#L18)

## Methods

### service()

> **service**\<`S`\>(`serviceDesc`, `handlers`): `void`

Defined in: [packages/events/src/EventRouter.ts:20](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/EventRouter.ts#L20)

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
