[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventContextInit

# Interface: EventContextInit

Defined in: [packages/events/src/types.ts:206](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L206)

Initialization data for creating an EventContext

## Properties

### onAck

> `readonly` **onAck**: () => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:209](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L209)

#### Returns

`Promise`\<`void`\>

***

### onNack

> `readonly` **onNack**: (`requeue`) => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:210](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L210)

#### Parameters

##### requeue

`boolean`

#### Returns

`Promise`\<`void`\>

***

### publish?

> `readonly` `optional` **publish?**: \<`Desc`\>(`schema`, `data`, `options?`) => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:212](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L212)

Implementation of `ctx.publish`; a context built without one rejects every publish.

Publish an event on behalf of this delivery: the way a relay handler (consume, transform,
publish) hands its result on.

While the bus is stopping, `bus.publish` is refused, but this call is still admitted as long
as the handler of this delivery has not returned and the drain has not been aborted, and
`stop()` waits for it before the adapter is disconnected. The right belongs to this one
delivery, this bus and this start/stop cycle: it ends when the handler's promise settles,
when the drain is aborted, and when the bus stops; a call after that is rejected. Await the
result inside the handler, so a failed publish fails the handler and the message is retried.

Handlers that publish through an injected bus instead of `ctx` keep being refused during
`stop()`; rewrite them to use `ctx.publish` to relay during shutdown.

#### Type Parameters

##### Desc

`Desc` *extends* [`DescMessage`](https://protobufes.com/reference/reflection/descriptors/#types)

#### Parameters

##### schema

`Desc`

##### data

`MessageShape`\<`Desc`\>

##### options?

[`PublishOptions`](PublishOptions.md)

#### Returns

`Promise`\<`void`\>

***

### raw

> `readonly` **raw**: [`RawEvent`](RawEvent.md)

Defined in: [packages/events/src/types.ts:207](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L207)

***

### signal

> `readonly` **signal**: `AbortSignal`

Defined in: [packages/events/src/types.ts:208](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L208)
