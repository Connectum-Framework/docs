[Connectum API Reference](../../../../../index.md) / [@connectum/interceptors](../../../index.md) / [@connectum/interceptors](../index.md) / BulkheadOptions

# Interface: BulkheadOptions

Defined in: [types.ts:166](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/interceptors/src/types.ts#L166)

Bulkhead interceptor options

## Properties

### capacity?

> `optional` **capacity**: `number`

Defined in: [types.ts:171](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/interceptors/src/types.ts#L171)

Maximum number of concurrent requests

#### Default

```ts
10
```

***

### queueSize?

> `optional` **queueSize**: `number`

Defined in: [types.ts:177](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/interceptors/src/types.ts#L177)

Maximum queue size for pending requests

#### Default

```ts
10
```

***

### skipStreaming?

> `optional` **skipStreaming**: `boolean`

Defined in: [types.ts:183](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/interceptors/src/types.ts#L183)

Skip bulkhead for streaming calls

#### Default

```ts
true
```
