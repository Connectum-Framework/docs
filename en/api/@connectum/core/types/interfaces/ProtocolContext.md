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

***

### services

> `readonly` **services**: readonly [`DescService`](https://protobufes.com/reference/reflection/descriptors/#types)[]

Defined in: [packages/core/src/types.ts:71](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L71)

Services mounted before this protocol, in registration order: every
mounted application service, then the services of the protocols that
precede this one in the `protocols` array. A frozen snapshot — later
registrations do not change it.

Use this, not `registry[].services`, to know which services the server
serves: a file in `registry` may also declare services that are not
mounted (for example under `enabledServices`).
