[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / resolveTopicName

# Function: resolveTopicName()

> **resolveTopicName**(`method`): `string`

Defined in: [packages/events/src/topic.ts:22](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/events/src/topic.ts#L22)

Resolve the topic name for an event handler method.

Priority:
1. Custom option: `option (connectum.events.v1.event).topic = "custom"`
2. Default: `method.input.typeName` (e.g., "mypackage.UserCreated")

## Parameters

### method

`DescMethod`

## Returns

`string`
