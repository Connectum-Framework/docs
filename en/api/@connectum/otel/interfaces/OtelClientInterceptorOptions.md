[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / OtelClientInterceptorOptions

# Interface: OtelClientInterceptorOptions

Defined in: [packages/otel/src/types.ts:75](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L75)

Options for createOtelClientInterceptor() (client-side)

## Extends

- [`OtelBaseOptions`](OtelBaseOptions.md)

## Properties

### attributeFilter?

> `optional` **attributeFilter**: [`OtelAttributeFilter`](../type-aliases/OtelAttributeFilter.md)

Defined in: [packages/otel/src/types.ts:40](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L40)

Filter callback to exclude specific attributes

#### Inherited from

[`OtelBaseOptions`](OtelBaseOptions.md).[`attributeFilter`](OtelBaseOptions.md#attributefilter)

***

### filter?

> `optional` **filter**: [`OtelFilter`](../type-aliases/OtelFilter.md)

Defined in: [packages/otel/src/types.ts:37](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L37)

Filter callback to skip specific requests

#### Inherited from

[`OtelBaseOptions`](OtelBaseOptions.md).[`filter`](OtelBaseOptions.md#filter)

***

### recordMessages?

> `optional` **recordMessages**: `boolean`

Defined in: [packages/otel/src/types.ts:47](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L47)

Include request/response message content in span events.
WARNING: May contain sensitive data.

#### Default

```ts
false
```

#### Inherited from

[`OtelBaseOptions`](OtelBaseOptions.md).[`recordMessages`](OtelBaseOptions.md#recordmessages)

***

### serverAddress

> **serverAddress**: `string`

Defined in: [packages/otel/src/types.ts:80](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L80)

Target server address (required for client spans).
Used as `server.address` attribute.

***

### serverPort?

> `optional` **serverPort**: `number`

Defined in: [packages/otel/src/types.ts:86](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L86)

Target server port.
Used as `server.port` attribute.

***

### withoutMetrics?

> `optional` **withoutMetrics**: `boolean`

Defined in: [packages/otel/src/types.ts:34](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L34)

Disable metric recording (tracing only)

#### Inherited from

[`OtelBaseOptions`](OtelBaseOptions.md).[`withoutMetrics`](OtelBaseOptions.md#withoutmetrics)

***

### withoutTracing?

> `optional` **withoutTracing**: `boolean`

Defined in: [packages/otel/src/types.ts:31](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/types.ts#L31)

Disable span creation (metrics only)

#### Inherited from

[`OtelBaseOptions`](OtelBaseOptions.md).[`withoutTracing`](OtelBaseOptions.md#withouttracing)
