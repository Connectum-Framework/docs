[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / SerializerOptions

# Interface: SerializerOptions

Defined in: [types.ts:122](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L122)

Serializer interceptor options

## Properties

### alwaysEmitImplicit?

> `optional` **alwaysEmitImplicit?**: `boolean`

Defined in: [types.ts:134](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L134)

Always emit implicit fields in JSON

#### Default

```ts
true
```

***

### ignoreUnknownFields?

> `optional` **ignoreUnknownFields?**: `boolean`

Defined in: [types.ts:140](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L140)

Ignore unknown fields when deserializing

#### Default

```ts
true
```

***

### skipGrpcServices?

> `optional` **skipGrpcServices?**: `boolean`

Defined in: [types.ts:128](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L128)

Skip services whose protobuf type name starts with `grpc.`.
The check applies to the service namespace, regardless of wire protocol.

#### Default

```ts
true
```
