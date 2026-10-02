[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / BulkheadOptions

# Interface: BulkheadOptions

Defined in: [types.ts:211](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L211)

Bulkhead interceptor options

## Properties

### capacity?

> `optional` **capacity?**: `number`

Defined in: [types.ts:216](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L216)

Maximum number of concurrent requests

#### Default

```ts
10
```

***

### queueSize?

> `optional` **queueSize?**: `number`

Defined in: [types.ts:222](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L222)

Maximum queue size for pending requests

#### Default

```ts
10
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:228](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L228)

Skip bulkhead for streaming calls

#### Default

```ts
true
```
