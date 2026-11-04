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

Defined in: [types.ts:83](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/types.ts#L83)

Custom HealthcheckManager instance.
Useful for testing or running multiple servers in one process.
When not provided, uses the default module-level singleton.

Servers that omit it share the singleton, and each server's start
re-initializes it with only that server's services. Starting a second
server therefore removes the services the second server does not mount:
the first keeps running but answers NOT_FOUND for its own services that
are missing there. Overall health (empty service name) is computed over
the one shared registry, so it also depends on the other server's
statuses. Give every server of a multi-server process its own
`createHealthcheckManager()`.

***

### watchInterval?

> `optional` **watchInterval?**: `number`

Defined in: [types.ts:67](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/types.ts#L67)

Period in milliseconds of the re-check that `Health.Watch` runs on top
of the manager's change notifications.

A change reaches watchers when the manager announces it, in order and
without waiting for this interval, so a status that changes and changes
back between two ticks is still delivered. The interval only bounds how
late a watcher learns of a state that changed without an announcement.

Must be an integer from 1 to 2147483647. Anything else throws
`RangeError` (or `TypeError` for a non-number, `null` included) from
`Healthcheck()`: zero, fractions, `NaN`, negative numbers and larger
values are turned into a 1 ms delay by the platform, which would make
every `Watch` call poll about a thousand times a second.

#### Default

```ts
500
```
