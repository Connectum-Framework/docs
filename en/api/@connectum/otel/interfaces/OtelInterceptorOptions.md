[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / OtelInterceptorOptions

# Interface: OtelInterceptorOptions

Defined in: [types.ts:60](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L60)

Options for createOtelInterceptor() (server-side)

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

### serverAddress?

> `optional` **serverAddress?**: `string`

Defined in: [types.ts:71](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L71)

Override server.address attribute (defaults to os.hostname())

***

### serverPort?

> `optional` **serverPort?**: `number`

Defined in: [types.ts:76](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L76)

Opt-in server.port attribute

***

### trustRemote?

> `optional` **trustRemote?**: `boolean`

Defined in: [types.ts:66](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/types.ts#L66)

Use extracted remote context as parent span.
When false, creates a new root span and adds a link to the remote span.

#### Default

```ts
false
```

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
