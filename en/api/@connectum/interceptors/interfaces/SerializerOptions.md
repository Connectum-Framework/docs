[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / SerializerOptions

# Interface: SerializerOptions

Defined in: [types.ts:97](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L97)

Serializer interceptor options

## Properties

### alwaysEmitImplicit?

> `optional` **alwaysEmitImplicit?**: `boolean`

Defined in: [types.ts:108](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L108)

Always emit implicit fields in JSON

#### Default

```ts
true
```

***

### ignoreUnknownFields?

> `optional` **ignoreUnknownFields?**: `boolean`

Defined in: [types.ts:114](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L114)

Ignore unknown fields when deserializing

#### Default

```ts
true
```

***

### skipGrpcServices?

> `optional` **skipGrpcServices?**: `boolean`

Defined in: [types.ts:102](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L102)

Skip serialization for gRPC services

#### Default

```ts
true
```
