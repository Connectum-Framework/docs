[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventContextInit

# Interface: EventContextInit

Defined in: [packages/events/src/types.ts:191](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L191)

Initialization data for creating an EventContext

## Properties

### onAck

> `readonly` **onAck**: () => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:194](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L194)

#### Returns

`Promise`\<`void`\>

***

### onNack

> `readonly` **onNack**: (`requeue`) => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:195](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L195)

#### Parameters

##### requeue

`boolean`

#### Returns

`Promise`\<`void`\>

***

### raw

> `readonly` **raw**: [`RawEvent`](RawEvent.md)

Defined in: [packages/events/src/types.ts:192](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L192)

***

### signal

> `readonly` **signal**: `AbortSignal`

Defined in: [packages/events/src/types.ts:193](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L193)
