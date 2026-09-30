[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / TimeoutOptions

# Interface: TimeoutOptions

Defined in: [types.ts:194](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L194)

Timeout interceptor options

## Properties

### duration?

> `optional` **duration?**: `number`

Defined in: [types.ts:199](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L199)

Request timeout in milliseconds

#### Default

```ts
30000 (30 seconds)
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:205](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L205)

Skip timeout for streaming calls

#### Default

```ts
true
```
