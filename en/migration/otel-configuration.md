---
title: OpenTelemetry Configuration Is Read Leniently
description: From 1.3.0, @connectum/otel ignores wrong OTEL_* variables with a process warning instead of failing every RPC, decodes OTEL_RESOURCE_ATTRIBUTES, rejects a misspelled initProvider settings value, and makes a concurrent shutdownProvider() wait for the flush.
docType: migration
---

# OpenTelemetry Configuration Is Read Leniently

> Applies to `@connectum/otel` 1.3.0.

## Does this apply to you?

You need to act only if **any** of these is true:

- you rely on a wrong `OTEL_*_EXPORTER`, `OTEL_EXPORTER_OTLP_PROTOCOL` or endpoint value to stop the service or fail a request (see [Wrong values warn](#wrong-values-warn));
- `OTEL_RESOURCE_ATTRIBUTES` contains a `%` that you did not mean as an escape, or `%2C` / `%3D` that you want to stay as written (see [Resource attributes are decoded](#resource-attributes-are-decoded));
- you pass `settings` to `initProvider()` with a name that is not an exporter (see [Misspelled settings throw](#misspelled-settings-throw));
- two shutdown hooks call `shutdownProvider()` and the second relied on returning at once (see [A concurrent shutdown waits](#a-concurrent-shutdown-waits)).

If you set valid `OTEL_*` variables and call `shutdownProvider()` once, nothing changes.

## Wrong values warn

Before 1.3.0 an empty `OTEL_TRACES_EXPORTER`, a value in upper case (`OTLP`), a list (`otlp,console`) or a name the package does not implement (`jaeger`, `zipkin`, `logging`) threw while the provider was created. The provider is created by the first instrumented call, so that call and every later one ended with `internal error`. The same happened for an unknown `OTEL_EXPORTER_OTLP_PROTOCOL`.

From 1.3.0:

| Variable value | Result |
|----------------|--------|
| empty | the same as unset |
| `OTLP`, `Otlp/GRPC` | matched case-insensitively |
| not in the documented list | ignored; a process warning with code `CONNECTUM_OTEL_INVALID_ENV` names the variable and the value; the default applies |
| an endpoint the exporter cannot use (`localhost:4318` over OTLP/HTTP; text that is not a URL) | ignored with the same warning; the base endpoint or the exporter default applies |

Nothing throws, so the service starts and answers requests. If you used the exception to catch a configuration mistake, listen for the warning instead:

```typescript
process.on('warning', (warning) => {
  if ((warning as { code?: string }).code === 'CONNECTUM_OTEL_INVALID_ENV') {
    console.error('OpenTelemetry configuration problem:', warning.message);
    process.exitCode = 1; // or call process.exit(1) at start-up, before the server listens
  }
});
```

The default exporter is unchanged: without an `OTEL_*_EXPORTER` variable a signal is written to standard output (`console`), not sent to a collector. Set `OTEL_TRACES_EXPORTER=otlp` (and the metrics and logs equivalents) to export. `getOTLPSettings()` now returns `console` for such a signal where it returned `undefined`.

## Resource attributes are decoded

`OTEL_RESOURCE_ATTRIBUTES` keys and values are percent-decoded, as the OpenTelemetry Resource SDK specification requires. `team=a%2Cb` now gives `a,b`; it gave `a%2Cb`. A `+` stays a `+`. A value that is not valid percent-encoding discards the whole variable and emits one `CONNECTUM_OTEL_INVALID_ENV` warning when the provider is created. Write a literal percent sign as `%25`.

## Misspelled settings throw

`initProvider({ settings: { traces: 'bogus' } })` selected the console exporter without a message. It now throws `TypeError` naming the key, the value and the accepted values: `console`, `otlp/http`, `otlp/http-protobuf`, `otlp/grpc`, `none`. A key other than `traces`, `metrics` or `logs` throws too. The bare `otlp` is an environment value only; use `otlp/http-protobuf` in `settings`.

## A concurrent shutdown waits

A `shutdownProvider()` call made while another call is stopping the provider used to return at once. It now waits for that stop and settles with the same outcome; if the first call rejects, the second rejects with the same error. Wrap the second call in `try`/`catch` if it must not fail.

`shutdownProvider({ timeout })` is new: it rejects with an error named `TimeoutError` after `timeout` milliseconds. Without it nothing changes; see [How long shutdown takes](/en/guide/observability/backends#how-long-shutdown-takes-with-an-unavailable-collector).
