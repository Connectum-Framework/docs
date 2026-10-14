[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / LoggerOptions

# Interface: LoggerOptions

Defined in: [types.ts:70](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L70)

Logger interceptor options

## Properties

### includeBodies?

> `optional` **includeBodies?**: `boolean`

Defined in: [types.ts:116](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L116)

Pass request and response bodies to the log sink.

Off by default: bodies carry credentials, tokens and personal data, and a
log line is usually kept far longer and readable by more people than the
call itself. By default a line carries only metadata (path, event,
duration, failure code). When on, a unary call passes its request and
response message to the sink as an extra argument, and a streaming call
passes the request message and the JSON form of each response message.

#### Default

```ts
false
```

***

### includeTransport?

> `optional` **includeTransport?**: `boolean`

Defined in: [types.ts:102](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L102)

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

Defined in: [types.ts:75](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L75)

Log level

#### Default

```ts
"debug"
```

***

### logger?

> `optional` **logger?**: (`message`, ...`args`) => `void`

Defined in: [types.ts:87](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L87)

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

Defined in: [types.ts:81](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L81)

Skip logging for health check services

#### Default

```ts
true
```
