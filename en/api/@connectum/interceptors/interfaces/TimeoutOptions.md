[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / TimeoutOptions

# Interface: TimeoutOptions

Defined in: [types.ts:179](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/interceptors/src/types.ts#L179)

Timeout interceptor options

## Properties

### duration?

> `optional` **duration?**: `number`

Defined in: [types.ts:184](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/interceptors/src/types.ts#L184)

Request timeout in milliseconds

#### Default

```ts
30000 (30 seconds)
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:190](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/interceptors/src/types.ts#L190)

Skip timeout for streaming calls

#### Default

```ts
true
```
