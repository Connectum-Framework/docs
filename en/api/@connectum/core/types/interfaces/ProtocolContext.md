[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ProtocolContext

# Interface: ProtocolContext

Defined in: [packages/core/src/types.ts:70](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L70)

Context provided to [ProtocolRegistration.setup](ProtocolRegistration.md#setup) and
[ProtocolRegistration.ready](ProtocolRegistration.md#ready)

Contains information about registered services that protocols
may need (e.g., reflection needs DescFile[], healthcheck needs service names).
What it covers depends on the hook: `setup` sees the services registered
before the protocol, `ready` sees all of them.

## Properties

### registry

> `readonly` **registry**: readonly `DescFile`[]

Defined in: [packages/core/src/types.ts:78](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L78)

Service file descriptors registered before this protocol: every mounted
application service, then the files of the protocols that precede this
one in the `protocols` array. In `ready` it is every file, protocols
after this one included. A frozen snapshot — later registrations do not
change it.

***

### services

> `readonly` **services**: readonly [`DescService`](https://protobufes.com/reference/reflection/descriptors/#types)[]

Defined in: [packages/core/src/types.ts:91](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L91)

Services mounted before this protocol, in registration order: every
mounted application service, then the services of the protocols that
precede this one in the `protocols` array. In `ready` it is every
service, protocols after this one included. A frozen snapshot — later
registrations do not change it.

Use this, not `registry[].services`, to know which services the server
serves: a file in `registry` may also declare services that are not
mounted (for example under `enabledServices`).
