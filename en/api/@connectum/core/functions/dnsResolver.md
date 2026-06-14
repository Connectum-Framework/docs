[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / dnsResolver

# Function: dnsResolver()

> **dnsResolver**(`options`): [`RemoteResolver`](../type-aliases/RemoteResolver.md)

Defined in: [packages/core/src/remoteResolver.ts:77](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/remoteResolver.ts#L77)

A resolver that derives a base URL per service from a DNS-style template and
builds a transport for it. Mirrors typical container/k8s service-name routing.
Always resolves (never `null`) — the template is assumed to cover every remote
service; use [mapResolver](mapResolver.md) for an explicit allow-list.

## Parameters

### options

[`DnsResolverOptions`](../interfaces/DnsResolverOptions.md)

## Returns

[`RemoteResolver`](../type-aliases/RemoteResolver.md)
