[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / resolveTopicName

# Function: resolveTopicName()

> **resolveTopicName**(`method`): `string`

Defined in: [packages/events/src/topic.ts:22](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/topic.ts#L22)

Resolve the topic name for an event handler method.

Priority:
1. Custom option: `option (connectum.events.v1.event).topic = "custom"`
2. Default: `method.input.typeName` (e.g., "mypackage.UserCreated")

## Parameters

### method

`DescMethod`

## Returns

`string`
