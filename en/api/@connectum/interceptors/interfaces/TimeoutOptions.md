[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / TimeoutOptions

# Interface: TimeoutOptions

Defined in: [types.ts:208](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L208)

Timeout interceptor options

## Properties

### duration?

> `optional` **duration?**: `number`

Defined in: [types.ts:213](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L213)

Request timeout in milliseconds

#### Default

```ts
30000 (30 seconds)
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:219](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L219)

Skip timeout for streaming calls

#### Default

```ts
true
```
