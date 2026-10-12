[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / BulkheadOptions

# Interface: BulkheadOptions

Defined in: [types.ts:233](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L233)

Bulkhead interceptor options

## Properties

### capacity?

> `optional` **capacity?**: `number`

Defined in: [types.ts:238](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L238)

Maximum number of concurrent requests

#### Default

```ts
10
```

***

### queueSize?

> `optional` **queueSize?**: `number`

Defined in: [types.ts:244](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L244)

Maximum queue size for pending requests

#### Default

```ts
10
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:250](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L250)

Skip bulkhead for streaming calls

#### Default

```ts
true
```
