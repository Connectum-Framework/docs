[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ProtocolContext

# Interface: ProtocolContext

Defined in: [packages/core/src/types.ts:52](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L52)

Context provided to [ProtocolRegistration.setup](ProtocolRegistration.md#setup)

Contains information about registered services that protocols
may need (e.g., reflection needs DescFile[], healthcheck needs service names).

## Properties

### registry

> `readonly` **registry**: readonly `DescFile`[]

Defined in: [packages/core/src/types.ts:59](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L59)

Service file descriptors registered before this protocol: every mounted
application service, then the files of the protocols that precede this
one in the `protocols` array. A frozen snapshot — later registrations do
not change it.
