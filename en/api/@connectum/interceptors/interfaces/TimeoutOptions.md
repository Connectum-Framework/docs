[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / TimeoutOptions

# Interface: TimeoutOptions

Defined in: [types.ts:241](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L241)

Timeout interceptor options

## Properties

### duration?

> `optional` **duration?**: `number`

Defined in: [types.ts:249](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L249)

Timeout in milliseconds for waiting on the downstream response.
Expiration cancels downstream work cooperatively and returns DeadlineExceeded.
Integer from 1 to 2147483647 (the platform timer ceiling); a larger value
would fire after 1 ms, so it is refused at construction.

#### Default

```ts
30000 (30 seconds)
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:257](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L257)

Skip timeout for streaming calls. If false, the timeout covers opening
the response, not its subsequent iteration. Caller cancellation continues
to reach the opened stream.

#### Default

```ts
true
```
