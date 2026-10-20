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

Defined in: [types.ts:49](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/types.ts#L49)

HTTP health endpoint paths that all respond with health status.

Must be a non-empty array of absolute paths: each starts with `/` and
contains no `?` or `#`. An empty array throws `RangeError` and an
invalid entry throws `TypeError` from `Healthcheck()`; to turn the HTTP
endpoint off use `httpEnabled: false`. Request paths are compared
exactly and case-sensitively (`/healthz/` does not match `/healthz`),
the query string is ignored when matching, and the request method is
not checked.

#### Default

```ts
["/healthz", "/health", "/readyz"]
```

***

### manager?

> `optional` **manager?**: [`HealthcheckManager`](../../classes/HealthcheckManager.md)

Defined in: [types.ts:62](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/types.ts#L62)

Custom HealthcheckManager instance.
Useful for testing or running multiple servers in one process.
When not provided, uses the default module-level singleton.

***

### watchInterval?

> `optional` **watchInterval?**: `number`

Defined in: [types.ts:55](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/types.ts#L55)

Watch interval in milliseconds for streaming health updates

#### Default

```ts
500
```
