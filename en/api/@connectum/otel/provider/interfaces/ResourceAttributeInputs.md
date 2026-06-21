[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / ResourceAttributeInputs

# Interface: ResourceAttributeInputs

Defined in: [packages/otel/src/provider.ts:82](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L82)

Inputs for [buildResourceAttributes](../functions/buildResourceAttributes.md).

## Properties

### env?

> `optional` **env?**: `object`

Defined in: [packages/otel/src/provider.ts:88](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L88)

Environment source (defaults to `process.env`).

#### OTEL\_RESOURCE\_ATTRIBUTES?

> `optional` **OTEL\_RESOURCE\_ATTRIBUTES?**: `string`

#### OTEL\_SERVICE\_INSTANCE\_ID?

> `optional` **OTEL\_SERVICE\_INSTANCE\_ID?**: `string`

***

### instanceId?

> `optional` **instanceId?**: `string`

Defined in: [packages/otel/src/provider.ts:85](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L85)

***

### resourceAttributes?

> `optional` **resourceAttributes?**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

Defined in: [packages/otel/src/provider.ts:86](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L86)

***

### serviceName

> **serviceName**: `string`

Defined in: [packages/otel/src/provider.ts:83](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L83)

***

### serviceVersion

> **serviceVersion**: `string`

Defined in: [packages/otel/src/provider.ts:84](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L84)
