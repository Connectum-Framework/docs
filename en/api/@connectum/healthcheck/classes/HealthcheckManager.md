[Connectum API Reference](../../../index.md) / [@connectum/healthcheck](../index.md) / HealthcheckManager

# Class: HealthcheckManager

Defined in: [HealthcheckManager.ts:26](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/healthcheck/src/HealthcheckManager.ts#L26)

Healthcheck manager

Manages health status for all registered services.
Module-level singleton. Import `healthcheckManager` from the package.

## Example

```typescript
import { healthcheckManager, ServingStatus } from '@connectum/healthcheck';

// After server.start():
healthcheckManager.update(ServingStatus.SERVING);
```

## Constructors

### Constructor

> **new HealthcheckManager**(): `HealthcheckManager`

#### Returns

`HealthcheckManager`

## Methods

### areAllHealthy()

> **areAllHealthy**(): `boolean`

Defined in: [HealthcheckManager.ts:80](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/healthcheck/src/HealthcheckManager.ts#L80)

Check if all services are healthy (SERVING)

#### Returns

`boolean`

True if all services are SERVING

***

### clear()

> **clear**(): `void`

Defined in: [HealthcheckManager.ts:108](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/healthcheck/src/HealthcheckManager.ts#L108)

Clear all services

#### Returns

`void`

***

### getAllStatuses()

> **getAllStatuses**(): `Map`\<`string`, [`ServiceStatus`](../interfaces/ServiceStatus.md)\>

Defined in: [HealthcheckManager.ts:71](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/healthcheck/src/HealthcheckManager.ts#L71)

Get all services health status

#### Returns

`Map`\<`string`, [`ServiceStatus`](../interfaces/ServiceStatus.md)\>

Map of service name to health status

***

### getStatus()

> **getStatus**(`service`): [`ServiceStatus`](../interfaces/ServiceStatus.md) \| `undefined`

Defined in: [HealthcheckManager.ts:62](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/healthcheck/src/HealthcheckManager.ts#L62)

Get service health status

#### Parameters

##### service

`string`

Service name

#### Returns

[`ServiceStatus`](../interfaces/ServiceStatus.md) \| `undefined`

Service status or undefined if not found

***

### initialize()

> **initialize**(`serviceNames`): `void`

Defined in: [HealthcheckManager.ts:96](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/healthcheck/src/HealthcheckManager.ts#L96)

Initialize services map

Merges new service names with existing state. Services that were
already registered retain their current status. New services start
with UNKNOWN status.

#### Parameters

##### serviceNames

`string`[]

Array of service names to track

#### Returns

`void`

***

### update()

> **update**(`status`, `service?`): `void`

Defined in: [HealthcheckManager.ts:39](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/healthcheck/src/HealthcheckManager.ts#L39)

Update service health status

When called without a service name, updates ALL registered services.
When called with an unknown service name, throws an error.

#### Parameters

##### status

`HealthCheckResponse_ServingStatus`

New serving status

##### service?

`string`

Service name (if not provided, updates all services)

#### Returns

`void`

#### Throws

Error if service name is provided but not registered
