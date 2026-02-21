[Connectum API Reference](../../../../../index.md) / [@connectum/otel](../../../index.md) / [@connectum/otel](../index.md) / OtelBaseOptions

# Interface: OtelBaseOptions

Defined in: [packages/otel/src/types.ts:29](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/types.ts#L29)

Common options shared between server and client OTel interceptors

## Extended by

- [`OtelClientInterceptorOptions`](OtelClientInterceptorOptions.md)
- [`OtelInterceptorOptions`](OtelInterceptorOptions.md)

## Properties

### attributeFilter?

> `optional` **attributeFilter**: [`OtelAttributeFilter`](../type-aliases/OtelAttributeFilter.md)

Defined in: [packages/otel/src/types.ts:40](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/types.ts#L40)

Filter callback to exclude specific attributes

***

### filter?

> `optional` **filter**: [`OtelFilter`](../type-aliases/OtelFilter.md)

Defined in: [packages/otel/src/types.ts:37](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/types.ts#L37)

Filter callback to skip specific requests

***

### recordMessages?

> `optional` **recordMessages**: `boolean`

Defined in: [packages/otel/src/types.ts:47](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/types.ts#L47)

Include request/response message content in span events.
WARNING: May contain sensitive data.

#### Default

```ts
false
```

***

### withoutMetrics?

> `optional` **withoutMetrics**: `boolean`

Defined in: [packages/otel/src/types.ts:34](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/types.ts#L34)

Disable metric recording (tracing only)

***

### withoutTracing?

> `optional` **withoutTracing**: `boolean`

Defined in: [packages/otel/src/types.ts:31](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/types.ts#L31)

Disable span creation (metrics only)
