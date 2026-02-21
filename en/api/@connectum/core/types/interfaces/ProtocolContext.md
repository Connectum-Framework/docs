[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ProtocolContext

# Interface: ProtocolContext

Defined in: [packages/core/src/types.ts:51](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/core/src/types.ts#L51)

Context provided to protocol registration functions

Contains information about registered services that protocols
may need (e.g., reflection needs DescFile[], healthcheck needs service names).

## Properties

### registry

> `readonly` **registry**: readonly `DescFile`[]

Defined in: [packages/core/src/types.ts:53](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/core/src/types.ts#L53)

Registered service file descriptors
