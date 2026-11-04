[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / OtelBaseOptions

# Interface: OtelBaseOptions

Defined in: [types.ts:36](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L36)

Common options shared between server and client OTel interceptors

## Extended by

- [`OtelClientInterceptorOptions`](OtelClientInterceptorOptions.md)
- [`OtelInterceptorOptions`](OtelInterceptorOptions.md)

## Properties

### attributeFilter?

> `optional` **attributeFilter?**: [`OtelAttributeFilter`](../type-aliases/OtelAttributeFilter.md)

Defined in: [types.ts:47](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L47)

Filter callback to exclude specific attributes

***

### filter?

> `optional` **filter?**: [`OtelFilter`](../type-aliases/OtelFilter.md)

Defined in: [types.ts:44](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L44)

Filter callback to skip specific requests

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

***

### withoutMetrics?

> `optional` **withoutMetrics?**: `boolean`

Defined in: [types.ts:41](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L41)

Disable metric recording (tracing only)

***

### withoutTracing?

> `optional` **withoutTracing?**: `boolean`

Defined in: [types.ts:38](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L38)

Disable span creation (metrics only)
