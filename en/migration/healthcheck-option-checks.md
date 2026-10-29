---
title: Healthcheck Option Checks
description: Healthcheck() and HealthcheckManager now refuse invalid watchInterval, options, statuses and a second registration, and Health.Watch delivers every change.
docType: migration
---

# Healthcheck Option Checks

> Applies to `@connectum/healthcheck` 1.3.0.

## Does this apply to you?

Inputs that used to be accepted and misbehaved later now fail where they are made. You need to act only if one of these is true:

- **`watchInterval`** is `0`, a fraction, `NaN`, negative, `Infinity`, above 2147483647, a string or `null`. `Healthcheck()` now throws `RangeError` (a number) or `TypeError` (not a number). Before, the number values made every `Health.Watch` call poll about once per millisecond, and a string or `null` made every `Watch` end with an internal error.
- **`Healthcheck()` receives a bad option:** `null` as the options object, a `manager` that is not a `HealthcheckManager`, or an `httpEnabled` that is not a boolean (`"yes"` and `1` used to count as true). It throws `TypeError` naming the option.
- **Two `Healthcheck()` entries** are in `protocols`, or the application mounts its own `grpc.health.v1.Health` service next to `Healthcheck()`. `start()` (and the first call made through `localClient()`) now rejects with an error naming the service. Before, the server started and one of the two managers was silently ignored.
- **A status that is not 0 to 3** is passed to `update()`, `register()` or `set()` of the manager: a string such as `"SERVING"`, `null`, `undefined`, a fraction, `99`. It throws `TypeError` or `RangeError` and the registry is not changed. Before, the value was stored and `Health.List` (for every service) and `Health.Check` of that component failed with an internal error. A component or service name that is not a string throws `TypeError`.
- **`createHttpHealthHandler(manager, [])`**, or a path list with a bad entry. It throws like `httpPaths` does in `Healthcheck()`. Before, it returned a handler that never matched a request.

Valid configurations and valid calls behave as before.

## Required changes

Fix the value the error names:

```typescript
// watchInterval: pick a whole number of milliseconds, or omit it for 500
Healthcheck({ watchInterval: 250 });

// one registration per server
createServer({ services, protocols: [Healthcheck({ httpEnabled: true })] });

// statuses are the ServingStatus constants
healthcheckManager.set('database', ServingStatus.NOT_SERVING);
```

If an application sets a status from outside input (a config value, a health-source response), map it to a `ServingStatus` constant first; the manager no longer converts or stores unknown values.

## Behavior that changed without an option

- **`Health.Watch` delivers every change.** A status that goes `NOT_SERVING` and back to `SERVING` inside one `watchInterval` used to be invisible to watchers; it is now two messages, and a change no longer waits for the interval. Watchers also see short intermediate states, for example `UNKNOWN` between a service being registered and its first `update()`. A client that counts messages or expects only the states a poll caught sees more of them. `watchInterval` remains the period of a re-check. `HealthcheckManager` gains `subscribe()`; a custom `manager` passed to `Healthcheck()` must have it, which every `HealthcheckManager` does.
- **The `NOT_FOUND` message of `Health.Check` is bounded.** It repeats at most the first 128 characters of the requested service name. A client that parses the full name out of the message sees it cut only for names longer than 128 characters.
- **`GET /healthz?service=`** (an empty value) reports `"service": "overall"` in the body, like a request without the parameter. Before, the field was an empty string.

## Verify the upgrade

Start the server. If `Healthcheck()` or `start()` throws, the message names the option or the Health service. Then run `grpcurl` against `grpc.health.v1.Health/Watch`: while it is open, set a service `NOT_SERVING` and `SERVING` back to back; the stream must show both statuses.

## Related

- [Health check protocol](/en/guide/health-checks/protocol)
- [HTTP health options are validated](/en/migration/healthcheck-http-options)
