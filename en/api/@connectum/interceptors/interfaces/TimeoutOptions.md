[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / TimeoutOptions

# Interface: TimeoutOptions

Defined in: [types.ts:238](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L238)

Timeout interceptor options

## Properties

### duration?

> `optional` **duration?**: `number`

Defined in: [types.ts:244](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L244)

Timeout in milliseconds for waiting on the downstream response.
Expiration cancels downstream work cooperatively and returns DeadlineExceeded.

#### Default

```ts
30000 (30 seconds)
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:252](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L252)

Skip timeout for streaming calls. If false, the timeout covers opening
the response, not its subsequent iteration. Caller cancellation continues
to reach the opened stream.

#### Default

```ts
true
```
