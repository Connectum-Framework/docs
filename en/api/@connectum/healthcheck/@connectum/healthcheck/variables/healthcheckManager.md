[Connectum API Reference](../../../../../index.md) / [@connectum/healthcheck](../../../index.md) / [@connectum/healthcheck](../index.md) / healthcheckManager

# Variable: healthcheckManager

> `const` **healthcheckManager**: [`HealthcheckManager`](../classes/HealthcheckManager.md)

Defined in: [Healthcheck.ts:41](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/healthcheck/src/Healthcheck.ts#L41)

Module-level singleton health manager

Importable from any file to update service health status.

## Example

```typescript
import { healthcheckManager, ServingStatus } from '@connectum/healthcheck';

healthcheckManager.update(ServingStatus.SERVING);
healthcheckManager.update(ServingStatus.NOT_SERVING, 'my.service.v1.MyService');
```
