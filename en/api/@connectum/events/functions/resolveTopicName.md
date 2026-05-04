[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / resolveTopicName

# Function: resolveTopicName()

> **resolveTopicName**(`method`): `string`

Defined in: [packages/events/src/topic.ts:22](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/topic.ts#L22)

Resolve the topic name for an event handler method.

Priority:
1. Custom option: `option (connectum.events.v1.event).topic = "custom"`
2. Default: `method.input.typeName` (e.g., "mypackage.UserCreated")

## Parameters

### method

`DescMethod`

## Returns

`string`
