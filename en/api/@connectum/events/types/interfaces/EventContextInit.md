[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventContextInit

# Interface: EventContextInit

Defined in: [packages/events/src/types.ts:153](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events/src/types.ts#L153)

Initialization data for creating an EventContext

## Properties

### onAck

> `readonly` **onAck**: () => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:156](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events/src/types.ts#L156)

#### Returns

`Promise`\<`void`\>

***

### onNack

> `readonly` **onNack**: (`requeue`) => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:157](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events/src/types.ts#L157)

#### Parameters

##### requeue

`boolean`

#### Returns

`Promise`\<`void`\>

***

### raw

> `readonly` **raw**: [`RawEvent`](RawEvent.md)

Defined in: [packages/events/src/types.ts:154](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events/src/types.ts#L154)

***

### signal

> `readonly` **signal**: `AbortSignal`

Defined in: [packages/events/src/types.ts:155](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events/src/types.ts#L155)
