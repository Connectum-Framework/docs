[Connectum API Reference](../../../index.md) / [@connectum/healthcheck](../index.md) / healthcheckManager

# Variable: healthcheckManager

> `const` **healthcheckManager**: [`HealthcheckManager`](../classes/HealthcheckManager.md)

Defined in: [Healthcheck.ts:40](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/healthcheck/src/Healthcheck.ts#L40)

Module-level singleton health manager

Importable from any file to update service health status.

## Example

```typescript
import { healthcheckManager, ServingStatus } from '@connectum/healthcheck';

healthcheckManager.update(ServingStatus.SERVING);
healthcheckManager.update(ServingStatus.NOT_SERVING, 'my.service.v1.MyService');
```
