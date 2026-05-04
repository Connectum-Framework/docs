[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventContextInit

# Interface: EventContextInit

Defined in: [packages/events/src/types.ts:155](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/types.ts#L155)

Initialization data for creating an EventContext

## Properties

### onAck

> `readonly` **onAck**: () => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:158](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/types.ts#L158)

#### Returns

`Promise`\<`void`\>

***

### onNack

> `readonly` **onNack**: (`requeue`) => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:159](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/types.ts#L159)

#### Parameters

##### requeue

`boolean`

#### Returns

`Promise`\<`void`\>

***

### raw

> `readonly` **raw**: [`RawEvent`](RawEvent.md)

Defined in: [packages/events/src/types.ts:156](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/types.ts#L156)

***

### signal

> `readonly` **signal**: `AbortSignal`

Defined in: [packages/events/src/types.ts:157](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/types.ts#L157)
