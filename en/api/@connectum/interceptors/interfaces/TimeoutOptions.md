[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / TimeoutOptions

# Interface: TimeoutOptions

Defined in: [types.ts:213](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L213)

Timeout interceptor options

## Properties

### duration?

> `optional` **duration?**: `number`

Defined in: [types.ts:219](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L219)

Timeout in milliseconds for waiting on the downstream response.
Expiration cancels downstream work cooperatively and returns DeadlineExceeded.

#### Default

```ts
30000 (30 seconds)
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:227](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L227)

Skip timeout for streaming calls. If false, the timeout covers opening
the response, not its subsequent iteration. Caller cancellation continues
to reach the opened stream.

#### Default

```ts
true
```
