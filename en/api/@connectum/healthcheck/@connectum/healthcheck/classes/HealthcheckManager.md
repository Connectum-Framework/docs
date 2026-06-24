[Connectum API Reference](../../../../../index.md) / [@connectum/healthcheck](../../../index.md) / [@connectum/healthcheck](../index.md) / HealthcheckManager

# Class: HealthcheckManager

Defined in: [HealthcheckManager.ts:79](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L79)

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

Defined in: [HealthcheckManager.ts:206](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L206)

Check if all services and components are healthy (SERVING)

#### Returns

`boolean`

True if all entries are SERVING; false for an empty registry

***

### clear()

> **clear**(): `void`

Defined in: [HealthcheckManager.ts:254](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L254)

Clear all services and components

#### Returns

`void`

***

### getAllStatuses()

> **getAllStatuses**(): `Map`\<`string`, [`ServiceStatus`](../types/interfaces/ServiceStatus.md)\>

Defined in: [HealthcheckManager.ts:193](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L193)

Get all services health status

#### Returns

`Map`\<`string`, [`ServiceStatus`](../types/interfaces/ServiceStatus.md)\>

Map of service/component name to health status

***

### getStatus()

> **getStatus**(`service`): [`ServiceStatus`](../types/interfaces/ServiceStatus.md) \| `undefined`

Defined in: [HealthcheckManager.ts:183](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L183)

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

Defined in: [HealthcheckManager.ts:229](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L229)

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

Defined in: [HealthcheckManager.ts:123](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L123)

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

`HealthCheckResponse_ServingStatus` = `ServingStatus.UNKNOWN`

Initial status (default UNKNOWN)

#### Returns

`void`

#### Throws

Error on invalid name or when the name belongs to an RPC service

***

### set()

> **set**(`component`, `status`): `void`

Defined in: [HealthcheckManager.ts:149](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L149)

Set a component's status (upsert).

Unlike `update()`, does not throw for unknown names: the component is
registered first if absent. Component names must be non-empty and
dot-free.

#### Parameters

##### component

`string`

Component name

##### status

`HealthCheckResponse_ServingStatus`

New serving status

#### Returns

`void`

#### Throws

Error on invalid name or when the name belongs to an RPC service

***

### unregister()

> **unregister**(`component`): `void`

Defined in: [HealthcheckManager.ts:166](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L166)

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

Defined in: [HealthcheckManager.ts:93](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/HealthcheckManager.ts#L93)

Update service health status

When called without a service name, updates ALL registered entries
(services and components alike).
When called with an unknown service name, throws an error.

#### Parameters

##### status

`HealthCheckResponse_ServingStatus`

New serving status

##### service?

`string`

Service name (if not provided, updates all entries)

#### Returns

`void`

#### Throws

Error if service name is provided but not registered
