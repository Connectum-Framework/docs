[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / OtelClientInterceptorOptions

# Interface: OtelClientInterceptorOptions

Defined in: [types.ts:82](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L82)

Options for createOtelClientInterceptor() (client-side)

## Extends

- [`OtelBaseOptions`](OtelBaseOptions.md)

## Properties

### attributeFilter?

> `optional` **attributeFilter?**: [`OtelAttributeFilter`](../type-aliases/OtelAttributeFilter.md)

Defined in: [types.ts:47](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L47)

Filter callback to exclude specific attributes

#### Inherited from

[`OtelBaseOptions`](OtelBaseOptions.md).[`attributeFilter`](OtelBaseOptions.md#attributefilter)

***

### filter?

> `optional` **filter?**: [`OtelFilter`](../type-aliases/OtelFilter.md)

Defined in: [types.ts:44](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L44)

Filter callback to skip specific requests

#### Inherited from

[`OtelBaseOptions`](OtelBaseOptions.md).[`filter`](OtelBaseOptions.md#filter)

***

### recordMessages?

> `optional` **recordMessages?**: `boolean`

Defined in: [types.ts:54](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L54)

Record request/response message events with direction, sequence number,
and estimated size. Message payloads are not included in these events.

#### Default

```ts
false
```

#### Inherited from

[`OtelBaseOptions`](OtelBaseOptions.md).[`recordMessages`](OtelBaseOptions.md#recordmessages)

***

### serverAddress

> **serverAddress**: `string`

Defined in: [types.ts:87](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L87)

Target server address (required for client spans).
Used as `server.address` attribute.

***

### serverPort?

> `optional` **serverPort?**: `number`

Defined in: [types.ts:93](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L93)

Target server port.
Used as `server.port` attribute.

***

### withoutMetrics?

> `optional` **withoutMetrics?**: `boolean`

Defined in: [types.ts:41](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L41)

Disable metric recording (tracing only)

#### Inherited from

[`OtelBaseOptions`](OtelBaseOptions.md).[`withoutMetrics`](OtelBaseOptions.md#withoutmetrics)

***

### withoutTracing?

> `optional` **withoutTracing?**: `boolean`

Defined in: [types.ts:38](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L38)

Disable span creation (metrics only)

#### Inherited from

[`OtelBaseOptions`](OtelBaseOptions.md).[`withoutTracing`](OtelBaseOptions.md#withouttracing)
