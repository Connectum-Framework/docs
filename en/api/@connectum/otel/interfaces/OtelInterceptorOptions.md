[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / OtelInterceptorOptions

# Interface: OtelInterceptorOptions

Defined in: [packages/otel/src/types.ts:53](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/types.ts#L53)

Options for createOtelInterceptor() (server-side)

## Extends

- [`OtelBaseOptions`](OtelBaseOptions.md)

## Properties

### attributeFilter?

> `optional` **attributeFilter**: [`OtelAttributeFilter`](../type-aliases/OtelAttributeFilter.md)

Defined in: [packages/otel/src/types.ts:40](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/types.ts#L40)

Filter callback to exclude specific attributes

#### Inherited from

[`OtelBaseOptions`](OtelBaseOptions.md).[`attributeFilter`](OtelBaseOptions.md#attributefilter)

***

### filter?

> `optional` **filter**: [`OtelFilter`](../type-aliases/OtelFilter.md)

Defined in: [packages/otel/src/types.ts:37](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/types.ts#L37)

Filter callback to skip specific requests

#### Inherited from

[`OtelBaseOptions`](OtelBaseOptions.md).[`filter`](OtelBaseOptions.md#filter)

***

### recordMessages?

> `optional` **recordMessages**: `boolean`

Defined in: [packages/otel/src/types.ts:47](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/types.ts#L47)

Include request/response message content in span events.
WARNING: May contain sensitive data.

#### Default

```ts
false
```

#### Inherited from

[`OtelBaseOptions`](OtelBaseOptions.md).[`recordMessages`](OtelBaseOptions.md#recordmessages)

***

### serverAddress?

> `optional` **serverAddress**: `string`

Defined in: [packages/otel/src/types.ts:64](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/types.ts#L64)

Override server.address attribute (defaults to os.hostname())

***

### serverPort?

> `optional` **serverPort**: `number`

Defined in: [packages/otel/src/types.ts:69](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/types.ts#L69)

Opt-in server.port attribute

***

### trustRemote?

> `optional` **trustRemote**: `boolean`

Defined in: [packages/otel/src/types.ts:59](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/types.ts#L59)

Use extracted remote context as parent span.
When false, creates a new root span and adds a link to the remote span.

#### Default

```ts
false
```

***

### withoutMetrics?

> `optional` **withoutMetrics**: `boolean`

Defined in: [packages/otel/src/types.ts:34](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/types.ts#L34)

Disable metric recording (tracing only)

#### Inherited from

[`OtelBaseOptions`](OtelBaseOptions.md).[`withoutMetrics`](OtelBaseOptions.md#withoutmetrics)

***

### withoutTracing?

> `optional` **withoutTracing**: `boolean`

Defined in: [packages/otel/src/types.ts:31](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/types.ts#L31)

Disable span creation (metrics only)

#### Inherited from

[`OtelBaseOptions`](OtelBaseOptions.md).[`withoutTracing`](OtelBaseOptions.md#withouttracing)
