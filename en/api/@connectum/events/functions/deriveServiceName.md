[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / deriveServiceName

# Function: deriveServiceName()

> **deriveServiceName**(`serviceNames`): `string` \| `undefined`

Defined in: [packages/events/src/EventBus.ts:42](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/EventBus.ts#L42)

Derive a service identifier from registered proto service type names.

Extracts unique package names and appends the hostname for
replica disambiguation.

## Parameters

### serviceNames

readonly `string`[]

## Returns

`string` \| `undefined`

Service name in format `"{packages}@{hostname}"`, or undefined if no services registered
