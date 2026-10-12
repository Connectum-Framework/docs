[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / ResourceAttributeInputs

# Interface: ResourceAttributeInputs

Defined in: [provider.ts:119](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L119)

Inputs for [buildResourceAttributes](../functions/buildResourceAttributes.md).

## Properties

### env?

> `optional` **env?**: `object`

Defined in: [provider.ts:126](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L126)

Environment source (defaults to `process.env`).

#### OTEL\_RESOURCE\_ATTRIBUTES?

> `optional` **OTEL\_RESOURCE\_ATTRIBUTES?**: `string`

#### OTEL\_SERVICE\_INSTANCE\_ID?

> `optional` **OTEL\_SERVICE\_INSTANCE\_ID?**: `string`

***

### instanceId?

> `optional` **instanceId?**: `string`

Defined in: [provider.ts:123](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L123)

***

### resourceAttributes?

> `optional` **resourceAttributes?**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

Defined in: [provider.ts:124](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L124)

***

### serviceName

> **serviceName**: `string`

Defined in: [provider.ts:121](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L121)

The final service name (see [resolveServiceName](../functions/resolveServiceName.md)); it is not overridden by `OTEL_RESOURCE_ATTRIBUTES`.

***

### serviceVersion

> **serviceVersion**: `string`

Defined in: [provider.ts:122](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L122)
