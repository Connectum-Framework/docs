[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / TimeoutOptions

# Interface: TimeoutOptions

Defined in: [types.ts:149](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/interceptors/src/types.ts#L149)

Timeout interceptor options

## Properties

### duration?

> `optional` **duration**: `number`

Defined in: [types.ts:154](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/interceptors/src/types.ts#L154)

Request timeout in milliseconds

#### Default

```ts
30000 (30 seconds)
```

***

### skipStreaming?

> `optional` **skipStreaming**: `boolean`

Defined in: [types.ts:160](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/interceptors/src/types.ts#L160)

Skip timeout for streaming calls

#### Default

```ts
true
```
