[Connectum API Reference](../../../../index.md) / [@connectum/healthcheck](../../../../index.md) / [@connectum/healthcheck/types](../index.md) / HealthcheckOptions

# Interface: HealthcheckOptions

Defined in: [types.ts:27](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/healthcheck/src/types.ts#L27)

Healthcheck protocol options

## Properties

### httpEnabled?

> `optional` **httpEnabled**: `boolean`

Defined in: [types.ts:32](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/healthcheck/src/types.ts#L32)

Enable HTTP health endpoints

#### Default

```ts
false
```

***

### httpPaths?

> `optional` **httpPaths**: `string`[]

Defined in: [types.ts:38](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/healthcheck/src/types.ts#L38)

HTTP health endpoint paths that all respond with health status.

#### Default

```ts
["/healthz", "/health", "/readyz"]
```

***

### manager?

> `optional` **manager**: [`HealthcheckManager`](../../classes/HealthcheckManager.md)

Defined in: [types.ts:51](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/healthcheck/src/types.ts#L51)

Custom HealthcheckManager instance.
Useful for testing or running multiple servers in one process.
When not provided, uses the default module-level singleton.

***

### watchInterval?

> `optional` **watchInterval**: `number`

Defined in: [types.ts:44](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/healthcheck/src/types.ts#L44)

Watch interval in milliseconds for streaming health updates

#### Default

```ts
500
```
