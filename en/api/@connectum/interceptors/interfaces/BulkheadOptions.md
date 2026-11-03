[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / BulkheadOptions

# Interface: BulkheadOptions

Defined in: [types.ts:274](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L274)

Bulkhead interceptor options

## Properties

### capacity?

> `optional` **capacity?**: `number`

Defined in: [types.ts:279](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L279)

Maximum number of concurrent requests. Integer of at least 1.

#### Default

```ts
10
```

***

### queueSize?

> `optional` **queueSize?**: `number`

Defined in: [types.ts:286](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L286)

Maximum queue size for pending requests. Integer of at least 0 (0 rejects
every request that arrives while all slots are busy).

#### Default

```ts
10
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:292](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L292)

Skip bulkhead for streaming calls

#### Default

```ts
true
```
