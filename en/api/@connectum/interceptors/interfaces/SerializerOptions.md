[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / SerializerOptions

# Interface: SerializerOptions

Defined in: [types.ts:68](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/interceptors/src/types.ts#L68)

Serializer interceptor options

## Properties

### alwaysEmitImplicit?

> `optional` **alwaysEmitImplicit**: `boolean`

Defined in: [types.ts:79](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/interceptors/src/types.ts#L79)

Always emit implicit fields in JSON

#### Default

```ts
true
```

***

### ignoreUnknownFields?

> `optional` **ignoreUnknownFields**: `boolean`

Defined in: [types.ts:85](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/interceptors/src/types.ts#L85)

Ignore unknown fields when deserializing

#### Default

```ts
true
```

***

### skipGrpcServices?

> `optional` **skipGrpcServices**: `boolean`

Defined in: [types.ts:73](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/interceptors/src/types.ts#L73)

Skip serialization for gRPC services

#### Default

```ts
true
```
