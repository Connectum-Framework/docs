[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / DnsResolverOptions

# Interface: DnsResolverOptions

Defined in: [packages/core/src/remoteResolver.ts:64](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/remoteResolver.ts#L64)

Options for [dnsResolver](../functions/dnsResolver.md).

## Properties

### createTransport?

> `readonly` `optional` **createTransport?**: (`baseUrl`) => `Transport`

Defined in: [packages/core/src/remoteResolver.ts:73](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/remoteResolver.ts#L73)

Build a `Transport` from the resolved base URL. Defaults to a gRPC (HTTP/2) transport.

#### Parameters

##### baseUrl

`string`

#### Returns

`Transport`

***

### template

> `readonly` **template**: `string`

Defined in: [packages/core/src/remoteResolver.ts:71](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/remoteResolver.ts#L71)

URL template with `{shortName}` (alias `{name}`) placeholders. The short
name is the last `typeName` segment, lower-cased, minus a trailing
`Service` (e.g. `orders.v1.OrdersService` → `orders`). A k8s/DNS route is
expressed directly, e.g. `"http://{shortName}.prod.svc.cluster.local:50051"`.
