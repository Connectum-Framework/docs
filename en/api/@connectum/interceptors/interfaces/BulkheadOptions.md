[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / BulkheadOptions

# Interface: BulkheadOptions

Defined in: [types.ts:166](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/interceptors/src/types.ts#L166)

Bulkhead interceptor options

## Properties

### capacity?

> `optional` **capacity**: `number`

Defined in: [types.ts:171](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/interceptors/src/types.ts#L171)

Maximum number of concurrent requests

#### Default

```ts
10
```

***

### queueSize?

> `optional` **queueSize**: `number`

Defined in: [types.ts:177](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/interceptors/src/types.ts#L177)

Maximum queue size for pending requests

#### Default

```ts
10
```

***

### skipStreaming?

> `optional` **skipStreaming**: `boolean`

Defined in: [types.ts:183](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/interceptors/src/types.ts#L183)

Skip bulkhead for streaming calls

#### Default

```ts
true
```
