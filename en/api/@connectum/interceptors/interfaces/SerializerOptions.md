[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / SerializerOptions

# Interface: SerializerOptions

Defined in: [types.ts:133](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L133)

Serializer interceptor options

## Properties

### alwaysEmitImplicit?

> `optional` **alwaysEmitImplicit?**: `boolean`

Defined in: [types.ts:145](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L145)

Always emit implicit fields in JSON

#### Default

```ts
true
```

***

### ignoreUnknownFields?

> `optional` **ignoreUnknownFields?**: `boolean`

Defined in: [types.ts:151](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L151)

Ignore unknown fields when deserializing

#### Default

```ts
true
```

***

### skipGrpcServices?

> `optional` **skipGrpcServices?**: `boolean`

Defined in: [types.ts:139](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L139)

Skip services whose protobuf type name starts with `grpc.`.
The check applies to the service namespace, regardless of wire protocol.

#### Default

```ts
true
```
