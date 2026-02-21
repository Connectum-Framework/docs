[Connectum API Reference](../../../../../index.md) / [@connectum/interceptors](../../../index.md) / [@connectum/interceptors](../index.md) / LoggerOptions

# Interface: LoggerOptions

Defined in: [types.ts:45](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/interceptors/src/types.ts#L45)

Logger interceptor options

## Properties

### level?

> `optional` **level**: `"error"` \| `"debug"` \| `"info"` \| `"warn"`

Defined in: [types.ts:50](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/interceptors/src/types.ts#L50)

Log level

#### Default

```ts
"debug"
```

***

### logger()?

> `optional` **logger**: (`message`, ...`args`) => `void`

Defined in: [types.ts:62](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/interceptors/src/types.ts#L62)

Custom logger function

#### Parameters

##### message

`string`

##### args

...`unknown`[]

#### Returns

`void`

#### Default

```ts
console[level]
```

***

### skipHealthCheck?

> `optional` **skipHealthCheck**: `boolean`

Defined in: [types.ts:56](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/interceptors/src/types.ts#L56)

Skip logging for health check services

#### Default

```ts
true
```
