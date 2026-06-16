[Connectum API Reference](../../../../../index.md) / [@connectum/healthcheck](../../../index.md) / [@connectum/healthcheck](../index.md) / healthcheckManager

# Variable: healthcheckManager

> `const` **healthcheckManager**: [`HealthcheckManager`](../classes/HealthcheckManager.md)

Defined in: [Healthcheck.ts:41](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/healthcheck/src/Healthcheck.ts#L41)

Module-level singleton health manager

Importable from any file to update service health status.

## Example

```typescript
import { healthcheckManager, ServingStatus } from '@connectum/healthcheck';

healthcheckManager.update(ServingStatus.SERVING);
healthcheckManager.update(ServingStatus.NOT_SERVING, 'my.service.v1.MyService');
```
