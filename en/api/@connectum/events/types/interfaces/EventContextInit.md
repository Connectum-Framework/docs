[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventContextInit

# Interface: EventContextInit

Defined in: [packages/events/src/types.ts:168](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L168)

Initialization data for creating an EventContext

## Properties

### onAck

> `readonly` **onAck**: () => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:171](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L171)

#### Returns

`Promise`\<`void`\>

***

### onNack

> `readonly` **onNack**: (`requeue`) => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:172](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L172)

#### Parameters

##### requeue

`boolean`

#### Returns

`Promise`\<`void`\>

***

### raw

> `readonly` **raw**: [`RawEvent`](RawEvent.md)

Defined in: [packages/events/src/types.ts:169](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L169)

***

### signal

> `readonly` **signal**: `AbortSignal`

Defined in: [packages/events/src/types.ts:170](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L170)
