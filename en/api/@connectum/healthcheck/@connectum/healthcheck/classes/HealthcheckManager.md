[Connectum API Reference](../../../../../index.md) / [@connectum/healthcheck](../../../index.md) / [@connectum/healthcheck](../index.md) / HealthcheckManager

# Class: HealthcheckManager

Defined in: [HealthcheckManager.ts:81](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L81)

Healthcheck manager

Manages health status for all registered services and components.
Module-level singleton. Import `healthcheckManager` from the package.

## Examples

**RPC service status (after server.start())**

```typescript
import { healthcheckManager, ServingStatus } from '@connectum/healthcheck';

healthcheckManager.update(ServingStatus.SERVING);
```

**RPC-less worker (poller, publisher, exporter)**

```typescript
import { healthcheckManager, ServingStatus } from '@connectum/healthcheck';

healthcheckManager.register('process');           // before or after start
server.on('ready', () => healthcheckManager.set('process', ServingStatus.SERVING));
server.on('stopping', () => healthcheckManager.set('process', ServingStatus.NOT_SERVING));
```

## Constructors

### Constructor

> **new HealthcheckManager**(): `HealthcheckManager`

#### Returns

`HealthcheckManager`

## Methods

### areAllHealthy()

> **areAllHealthy**(): `boolean`

Defined in: [HealthcheckManager.ts:318](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L318)

Check if all services and components are healthy (SERVING)

#### Returns

`boolean`

True if all entries are SERVING; false for an empty registry

***

### clear()

> **clear**(): `void`

Defined in: [HealthcheckManager.ts:368](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L368)

Clear all services and components

#### Returns

`void`

***

### getAllStatuses()

> **getAllStatuses**(): `Map`\<`string`, [`ServiceStatus`](../types/interfaces/ServiceStatus.md)\>

Defined in: [HealthcheckManager.ts:305](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L305)

Get health status for all registered services and components.

#### Returns

`Map`\<`string`, [`ServiceStatus`](../types/interfaces/ServiceStatus.md)\>

Map of service/component name to health status

***

### getStatus()

> **getStatus**(`service`): [`ServiceStatus`](../types/interfaces/ServiceStatus.md) \| `undefined`

Defined in: [HealthcheckManager.ts:295](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L295)

Get service health status

#### Parameters

##### service

`string`

Service or component name

#### Returns

[`ServiceStatus`](../types/interfaces/ServiceStatus.md) \| `undefined`

Service status or undefined if not found

***

### initialize()

> **initialize**(`serviceNames`): `void`

Defined in: [HealthcheckManager.ts:341](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L341)

Initialize the RPC service slice of the registry.

Affects only `service`-kind entries:
- names in `serviceNames` are added (UNKNOWN) or preserved with their
  current status;
- `service` entries absent from `serviceNames` are removed — pollers on
  `watch` observe SERVICE_UNKNOWN for them afterwards;
- `component` entries are never touched, so components registered
  before `server.start()` survive protocol initialization.

Called by the Healthcheck protocol on server start; not intended for
application code.

#### Parameters

##### serviceNames

`string`[]

Array of RPC service typeNames to track

#### Returns

`void`

***

### register()

> **register**(`component`, `initialStatus?`): `void`

Defined in: [HealthcheckManager.ts:225](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L225)

Register an application health component.

A registered component is a readiness gate: it participates in
`areAllHealthy()`, gRPC `Check`/`Watch`, and `/healthz` exactly like an
RPC service. Registering an already-registered component does NOT reset
its status. Component names must be non-empty and dot-free.

#### Parameters

##### component

`string`

Component name (e.g. "process", "amqp")

##### initialStatus?

[`HealthCheckResponse_ServingStatus`](https://github.com/grpc/grpc-proto/blob/master/grpc/health/v1/health.proto) = `ServingStatus.UNKNOWN`

Initial status (default UNKNOWN when omitted)

#### Returns

`void`

#### Throws

when `component` is not a string, or `initialStatus` is given and is not a number

#### Throws

when `initialStatus` is a number other than 0, 1, 2 or 3

#### Throws

Error on an empty or dotted name, or when the name belongs to an RPC service

***

### set()

> **set**(`component`, `status`): `void`

Defined in: [HealthcheckManager.ts:256](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L256)

Set a component's status (upsert).

Unlike `update()`, does not throw for unknown names: the component is
registered first if absent. Component names must be non-empty and
dot-free.

#### Parameters

##### component

`string`

Component name

##### status

[`HealthCheckResponse_ServingStatus`](https://github.com/grpc/grpc-proto/blob/master/grpc/health/v1/health.proto)

New serving status: one of the four `ServingStatus` values

#### Returns

`void`

#### Throws

when `component` is not a string or `status` is not a number

#### Throws

when `status` is a number other than 0, 1, 2 or 3

#### Throws

Error on an empty or dotted name, or when the name belongs to an RPC service

***

### subscribe()

> **subscribe**(`listener`): () => `void`

Defined in: [HealthcheckManager.ts:135](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L135)

Be told about every change of the registry.

The listener runs synchronously, after the new state is in place, once
per `update`, `register` (of a new name), `set`, `unregister` (of a
registered name), `initialize` and `clear`. It receives no payload:
read the state you care about with `getStatus()` or `getAllStatuses()`.
A mutation that is refused (invalid status, unknown service) does not
notify. `Health.Watch` is built on this, which is why a status that
changes and changes back between two polls still reaches watchers.

A listener that throws does not stop the others: every listener runs,
then the first error is rethrown to the caller of the mutation. The
mutation itself is not undone.

A listener must not change the registry: `update`, `register`, `set`,
`unregister`, `initialize` and `clear` called from inside a listener
throw. Each listener sees the state of the mutation that notified it,
and a nested change would hide that transition from the listeners after
it. Defer the change (for example with `queueMicrotask`) instead.

#### Parameters

##### listener

() => `void`

Function called after each change

#### Returns

Function that removes the listener; calling it again does nothing

() => `void`

#### Throws

when `listener` is not a function

***

### unregister()

> **unregister**(`component`): `void`

Defined in: [HealthcheckManager.ts:276](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L276)

Remove a registered component.

#### Parameters

##### component

`string`

Component name

#### Returns

`void`

#### Throws

Error when the name belongs to an RPC service

***

### update()

> **update**(`status`, `service?`): `void`

Defined in: [HealthcheckManager.ts:186](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L186)

Update service health status

When called without a service name, updates ALL registered entries
(services and components alike).
When called with an unknown service name, throws an error.

#### Parameters

##### status

[`HealthCheckResponse_ServingStatus`](https://github.com/grpc/grpc-proto/blob/master/grpc/health/v1/health.proto)

New serving status: one of the four `ServingStatus` values

##### service?

`string`

Service name (if not provided, updates all entries)

#### Returns

`void`

#### Throws

if `status` is not a number, or `service` is given and is not a string

#### Throws

if `status` is a number other than 0, 1, 2 or 3

#### Throws

Error if service name is provided but not registered
