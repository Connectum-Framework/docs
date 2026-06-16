[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / buildBaseAttributes

# Function: buildBaseAttributes()

> **buildBaseAttributes**(`params`): `Record`\<`string`, `string` \| `number`\>

Defined in: [packages/otel/src/shared.ts:160](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/otel/src/shared.ts#L160)

Builds standard RPC base attributes per OTel semantic conventions.

## Parameters

### params

[`BaseAttributeParams`](../interfaces/BaseAttributeParams.md)

Service, method, server address/port info

## Returns

`Record`\<`string`, `string` \| `number`\>

Record of base attributes
