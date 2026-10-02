[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / SerializerOptions

# Interface: SerializerOptions

Defined in: [types.ts:83](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L83)

Serializer interceptor options

## Properties

### alwaysEmitImplicit?

> `optional` **alwaysEmitImplicit?**: `boolean`

Defined in: [types.ts:94](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L94)

Always emit implicit fields in JSON

#### Default

```ts
true
```

***

### ignoreUnknownFields?

> `optional` **ignoreUnknownFields?**: `boolean`

Defined in: [types.ts:100](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L100)

Ignore unknown fields when deserializing

#### Default

```ts
true
```

***

### skipGrpcServices?

> `optional` **skipGrpcServices?**: `boolean`

Defined in: [types.ts:88](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L88)

Skip serialization for gRPC services

#### Default

```ts
true
```
