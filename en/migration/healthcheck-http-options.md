---
title: HTTP Health Options Are Validated
description: From 1.3.0, Healthcheck() rejects an empty or malformed httpPaths, and the service query of the HTTP health endpoint no longer depends on the Host header.
docType: migration
---

# HTTP Health Options Are Validated

> Applies to `@connectum/healthcheck` 1.3.0.

## Does this apply to you?

You need to act only if your code passes `httpPaths` to `Healthcheck()`:

- `httpPaths: []` now throws a `RangeError` when `Healthcheck()` is called. Before, it left `httpEnabled: true` with an endpoint that matched nothing.
- An entry that is not a string, does not start with `/`, or contains `?` or `#` now throws a `TypeError`. Before, it was accepted and never matched a request.

If you do not pass `httpPaths`, or you pass a non-empty list of absolute paths, nothing changes. The check runs whenever `httpPaths` is passed, also with `httpEnabled: false`.

## Required changes

Choose one for each affected call:

- **You used `[]` to turn the HTTP endpoint off.** Remove `httpPaths` and set `httpEnabled: false` (the endpoint is off by default).
- **An entry had no leading slash.** Write an absolute path: `'healthz'` becomes `'/healthz'`.
- **An entry carried a query or a fragment.** Remove the `?...` or `#...` part; a request path never contains it, and the query string is ignored when matching.

```typescript
// Before: HTTP "disabled" by an empty list
Healthcheck({ httpEnabled: true, httpPaths: [] });

// After
Healthcheck({ httpEnabled: false });
```

## Behavior that did not change

Paths are matched exactly and case-sensitively (`/healthz/` does not match `/healthz`), the query string is ignored when matching, and the request method is not checked.

One defect is fixed with no action on your side: `/healthz?service=<name>` used to answer with the overall state when the request carried an empty or malformed `Host` header. It now describes `<name>` for any `Host` value.

## Verify the upgrade

Start the server and request `/healthz?service=<a service you track>`; the `service` field of the body must be that name. If `Healthcheck()` throws at startup, the message names the `httpPaths` option and the entry that failed.

## Related

- [Health check protocol: HTTP endpoints](/en/guide/health-checks/protocol#http-health-endpoints)
