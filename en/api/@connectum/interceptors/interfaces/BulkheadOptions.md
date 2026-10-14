[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / BulkheadOptions

# Interface: BulkheadOptions

Defined in: [types.ts:258](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L258)

Bulkhead interceptor options

## Properties

### capacity?

> `optional` **capacity?**: `number`

Defined in: [types.ts:263](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L263)

Maximum number of concurrent requests

#### Default

```ts
10
```

***

### queueSize?

> `optional` **queueSize?**: `number`

Defined in: [types.ts:269](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L269)

Maximum queue size for pending requests

#### Default

```ts
10
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:275](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L275)

Skip bulkhead for streaming calls

#### Default

```ts
true
```
