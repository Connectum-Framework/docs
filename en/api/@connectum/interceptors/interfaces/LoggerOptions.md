[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / LoggerOptions

# Interface: LoggerOptions

Defined in: [types.ts:45](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L45)

Logger interceptor options

## Properties

### includeTransport?

> `optional` **includeTransport?**: `boolean`

Defined in: [types.ts:77](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L77)

Tag every log line with the transport that carried the call, right
after the `RPC` / `STREAM` prefix: `[in-process]` for calls made through
`server.localClient()` / `createLocalTransport()` of `@connectum/core`,
`[http]` for every other call (gRPC, Connect or gRPC-Web over HTTP).

The tag is for reading logs only. It comes from a framework-internal
request marker, so it must not drive authorization or any other
security decision; decide on `req.service.typeName` and
`req.method.name` instead.

#### Default

```ts
false
```

***

### level?

> `optional` **level?**: `"error"` \| `"warn"` \| `"debug"` \| `"info"`

Defined in: [types.ts:50](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L50)

Log level

#### Default

```ts
"debug"
```

***

### logger?

> `optional` **logger?**: (`message`, ...`args`) => `void`

Defined in: [types.ts:62](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L62)

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

> `optional` **skipHealthCheck?**: `boolean`

Defined in: [types.ts:56](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L56)

Skip logging for health check services

#### Default

```ts
true
```
