[Connectum API Reference](../../../../../index.md) / [@connectum/interceptors](../../../index.md) / [@connectum/interceptors](../index.md) / SerializerOptions

# Interface: SerializerOptions

Defined in: [types.ts:68](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/interceptors/src/types.ts#L68)

Serializer interceptor options

## Properties

### alwaysEmitImplicit?

> `optional` **alwaysEmitImplicit**: `boolean`

Defined in: [types.ts:79](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/interceptors/src/types.ts#L79)

Always emit implicit fields in JSON

#### Default

```ts
true
```

***

### ignoreUnknownFields?

> `optional` **ignoreUnknownFields**: `boolean`

Defined in: [types.ts:85](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/interceptors/src/types.ts#L85)

Ignore unknown fields when deserializing

#### Default

```ts
true
```

***

### skipGrpcServices?

> `optional` **skipGrpcServices**: `boolean`

Defined in: [types.ts:73](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/interceptors/src/types.ts#L73)

Skip serialization for gRPC services

#### Default

```ts
true
```
