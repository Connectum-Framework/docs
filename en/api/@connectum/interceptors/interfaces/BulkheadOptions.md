[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / BulkheadOptions

# Interface: BulkheadOptions

Defined in: [types.ts:225](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L225)

Bulkhead interceptor options

## Properties

### capacity?

> `optional` **capacity?**: `number`

Defined in: [types.ts:230](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L230)

Maximum number of concurrent requests

#### Default

```ts
10
```

***

### queueSize?

> `optional` **queueSize?**: `number`

Defined in: [types.ts:236](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L236)

Maximum queue size for pending requests

#### Default

```ts
10
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:242](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L242)

Skip bulkhead for streaming calls

#### Default

```ts
true
```
