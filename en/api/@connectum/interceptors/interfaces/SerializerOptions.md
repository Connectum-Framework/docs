[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / SerializerOptions

# Interface: SerializerOptions

Defined in: [types.ts:97](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L97)

Serializer interceptor options

## Properties

### alwaysEmitImplicit?

> `optional` **alwaysEmitImplicit?**: `boolean`

Defined in: [types.ts:109](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L109)

Always emit implicit fields in JSON

#### Default

```ts
true
```

***

### ignoreUnknownFields?

> `optional` **ignoreUnknownFields?**: `boolean`

Defined in: [types.ts:115](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L115)

Ignore unknown fields when deserializing

#### Default

```ts
true
```

***

### skipGrpcServices?

> `optional` **skipGrpcServices?**: `boolean`

Defined in: [types.ts:103](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L103)

Skip services whose protobuf type name starts with `grpc.`.
The check applies to the service namespace, regardless of wire protocol.

#### Default

```ts
true
```
