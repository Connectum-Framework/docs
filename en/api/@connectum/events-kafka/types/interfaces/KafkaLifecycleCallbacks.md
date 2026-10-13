[Connectum API Reference](../../../../index.md) / [@connectum/events-kafka](../../index.md) / [types](../index.md) / KafkaLifecycleCallbacks

# Interface: KafkaLifecycleCallbacks

Defined in: [types.ts:255](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L255)

Callbacks for the lifecycle of the Kafka adapter.

## Properties

### onLifecycle?

> `readonly` `optional` **onLifecycle?**: (`event`) => `void` \| `Promise`\<`void`\>

Defined in: [types.ts:261](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L261)

Called for every [KafkaLifecycleEvent](../type-aliases/KafkaLifecycleEvent.md). It should not throw: a thrown exception or a rejected
returned promise is isolated and reported as a `lifecycle-error` event, and a failure while handling
that one is dropped. A returned promise is not awaited.

#### Parameters

##### event

[`KafkaLifecycleEvent`](../type-aliases/KafkaLifecycleEvent.md)

#### Returns

`void` \| `Promise`\<`void`\>
