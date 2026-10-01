[Connectum API Reference](../../../../../../index.md) / [@connectum/healthcheck](../../../../index.md) / [@connectum/healthcheck/types](../index.md) / HealthcheckOptions

# Interface: HealthcheckOptions

Defined in: [types.ts:30](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/types.ts#L30)

Healthcheck protocol options

## Properties

### httpEnabled?

> `optional` **httpEnabled?**: `boolean`

Defined in: [types.ts:35](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/types.ts#L35)

Enable HTTP health endpoints

#### Default

```ts
false
```

***

### httpPaths?

> `optional` **httpPaths?**: `string`[]

Defined in: [types.ts:41](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/types.ts#L41)

HTTP health endpoint paths that all respond with health status.

#### Default

```ts
["/healthz", "/health", "/readyz"]
```

***

### manager?

> `optional` **manager?**: [`HealthcheckManager`](../../classes/HealthcheckManager.md)

Defined in: [types.ts:54](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/types.ts#L54)

Custom HealthcheckManager instance.
Useful for testing or running multiple servers in one process.
When not provided, uses the default module-level singleton.

***

### watchInterval?

> `optional` **watchInterval?**: `number`

Defined in: [types.ts:47](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/types.ts#L47)

Watch interval in milliseconds for streaming health updates

#### Default

```ts
500
```
