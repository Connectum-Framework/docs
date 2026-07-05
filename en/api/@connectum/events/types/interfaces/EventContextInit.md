[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventContextInit

# Interface: EventContextInit

Defined in: [packages/events/src/types.ts:183](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L183)

Initialization data for creating an EventContext

## Properties

### onAck

> `readonly` **onAck**: () => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:186](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L186)

#### Returns

`Promise`\<`void`\>

***

### onNack

> `readonly` **onNack**: (`requeue`) => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:187](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L187)

#### Parameters

##### requeue

`boolean`

#### Returns

`Promise`\<`void`\>

***

### raw

> `readonly` **raw**: [`RawEvent`](RawEvent.md)

Defined in: [packages/events/src/types.ts:184](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L184)

***

### signal

> `readonly` **signal**: `AbortSignal`

Defined in: [packages/events/src/types.ts:185](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L185)
