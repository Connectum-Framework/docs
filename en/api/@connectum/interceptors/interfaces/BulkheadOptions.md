[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / BulkheadOptions

# Interface: BulkheadOptions

Defined in: [types.ts:263](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L263)

Bulkhead interceptor options

## Properties

### capacity?

> `optional` **capacity?**: `number`

Defined in: [types.ts:268](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L268)

Maximum number of concurrent requests. Integer of at least 1.

#### Default

```ts
10
```

***

### queueSize?

> `optional` **queueSize?**: `number`

Defined in: [types.ts:275](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L275)

Maximum queue size for pending requests. Integer of at least 0 (0 rejects
every request that arrives while all slots are busy).

#### Default

```ts
10
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:281](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L281)

Skip bulkhead for streaming calls

#### Default

```ts
true
```
