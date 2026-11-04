---
title: RPC Telemetry Attribute Names
description: From 1.3.0, @connectum/otel names RPC span and metric attributes after the current OpenTelemetry RPC conventions and leaves the span status unset on success; update dashboards, alerts and code that use the old names, constants or status = ok.
docType: migration
---

# RPC Telemetry Attribute Names

> Applies to 1.3.0.

## Does this apply to you?

You need to act only if **any** of these is true:

- a dashboard, alert, recording rule or query filters or groups on `rpc.system`, `rpc.service`, `rpc.method` or `rpc.connect_rpc.status_code` (Prometheus labels `rpc_system`, `rpc_service`, `rpc_method`, `rpc_connect_rpc_status_code`);
- a span processor, sampler or `attributeFilter` reads those attributes from spans created by `@connectum/otel`;
- your code imports `ATTR_RPC_SYSTEM`, `ATTR_RPC_SERVICE`, `ATTR_RPC_CONNECT_RPC_STATUS_CODE` or `RPC_SYSTEM_CONNECT_RPC` from `@connectum/otel`;
- a trace query, dashboard, alert or collector sampling rule selects spans by `status = ok` (see [Span status is unset on success](#span-status-is-unset-on-success));
- a query counts canceled calls and matches only one spelling of the code (see [Cancellation spelling](#cancellation-spelling));
- a dashboard, SLO or alert reads the `rpc.{server,client}.{request,response}.size` histograms, the call duration of a streaming method, `error.type` on failed streams, the span status of server spans for codes such as `NOT_FOUND`, or `exception.type` (see [Streams, sizes and server span status](#streams-sizes-and-server-span-status)).

If you only export telemetry to a backend and look at traces by service and method, nothing breaks: the span name did not change.

## What changed

The server and client interceptors now use the attribute names of the OpenTelemetry RPC conventions for Connect:

| Before | From 1.3.0 |
|--------|------------|
| `rpc.system` = `connect_rpc` | `rpc.system.name` = `connectrpc` |
| `rpc.service` = `acme.v1.Greeter` and `rpc.method` = `SayHello` | `rpc.method` = `acme.v1.Greeter/SayHello` (equal to the span name); `rpc.service` is gone |
| `rpc.connect_rpc.status_code` = `5` (number, failed calls only) | `rpc.response.status_code` = `NOT_FOUND` (string; `OK` after a successful unary call) |
| `error.type` = `NOT_FOUND` | unchanged; on a Connect error it equals `rpc.response.status_code` |

A streaming call that ends normally, or whose consumer stops reading it, carries no `rpc.response.status_code`; a stream that fails after it started carries the code of the failure (see [Streams, sizes and server span status](#streams-sizes-and-server-span-status)).

`ATTR_RPC_SYSTEM`, `ATTR_RPC_SERVICE`, `ATTR_RPC_CONNECT_RPC_STATUS_CODE` and `RPC_SYSTEM_CONNECT_RPC` are removed. Use `ATTR_RPC_SYSTEM_NAME`, `ATTR_RPC_RESPONSE_STATUS_CODE` and `RPC_SYSTEM_NAME_CONNECTRPC`. `getLogger()` now names a logger after the service part of `rpc.method`.

Not renamed: the `rpc.{server,client}.{request,response}.size` histograms and the `rpc.message` span events. The conventions define no replacement; they stay as Connectum-specific telemetry, and `rpc.message` events remain off unless you set `recordMessages: true`. Their values changed: see [Streams, sizes and server span status](#streams-sizes-and-server-span-status).

Also from 1.3.0, `rpc.server.call.duration` and `rpc.client.call.duration` use second-scale bucket boundaries; see [Duration bucket boundaries](/en/guide/observability/metrics#duration-bucket-boundaries).

## Required changes

Update every query that uses the old names. For a PromQL selector:

```text
# before
rate(rpc_server_call_duration_seconds_count{rpc_service="acme.v1.Greeter", rpc_method="SayHello"}[5m])

# after
rate(rpc_server_call_duration_seconds_count{rpc_method="acme.v1.Greeter/SayHello"}[5m])
```

To select a whole service, match the prefix: `rpc_method=~"acme.v1.Greeter/.*"`. Replace `rpc_connect_rpc_status_code="5"` with `rpc_response_status_code="NOT_FOUND"`, and `rpc_system="connect_rpc"` with `rpc_system_name="connectrpc"`.

Replace the removed constants in code with the new ones listed above.

## Span status is unset on success

Before 1.3.0 a successful server call, client call, stream, `traced()` function and `traceAll()` method ended its span with status `OK`. From 1.3.0 the status stays **unset**, as the OpenTelemetry Trace API and the RPC conventions ask of instrumentation libraries (`otelconnect-go`, `otelgrpc` and the Node gRPC instrumentation do the same). `ERROR`, with the error message, is the only status `@connectum/otel` sets, and only when a call or function fails (for a server span, only with the codes listed in [Streams, sizes and server span status](#streams-sizes-and-server-span-status)). A stream whose consumer stops early (`return()` or `break`) also ends unset.

Update every query that selects successes by span status:

| Before | From 1.3.0 |
|--------|------------|
| `status = ok` | `status != error` for calls without an error; `rpc.response.status_code = "OK"` for confirmed successes |
| success rate = OK spans / all spans | `rpc.response.status_code = "OK"` over all calls. `1 - error spans / all spans` is a non-error rate: it also counts streams that a consumer stopped early |
| errors: `status = error` | unchanged |

The `rpc.response.status_code` attribute still reports `OK` for a successful unary call, and the metrics, `error.type` and span events are unchanged. If a backend shows an unset status as "unknown", that is the meaning the specification gives to the unset state; failures are the spans in the error state.

## Streams, sizes and server span status

Six corrections to the values that `@connectum/otel` reports. Names are unchanged; the values move, so check the queries that read them.

| What | Before | From 1.3.0 |
|------|--------|------------|
| `rpc.{server,client}.{request,response}.size` of a unary call, and `rpc.message.uncompressed_size` of `rpc.message` events | always `0` with protobuf-es v2 | the length of the message's Protobuf encoding in bytes. Aggregate size histograms of a streaming call stay `0`; the events of a stream carry the size of each message |
| `rpc.{server,client}.call.duration` of a streaming call | recorded when the response head returned (milliseconds) | recorded when the stream ends, equal to the span duration |
| `error.type` and `rpc.response.status_code` of a stream that fails after it started | absent on the span and the metric | present on the span and on the duration metric point: `error.type` and `rpc.response.status_code` carry the code name for a Connect error, and `error.type` the error class name for another error |
| Server span status for `not_found`, `invalid_argument`, `permission_denied`, `unauthenticated`, `failed_precondition`, `already_exists`, `resource_exhausted`, `aborted`, `out_of_range`, `canceled` | `ERROR` | unset. `ERROR` stays for `unknown`, `deadline_exceeded`, `unimplemented`, `internal`, `unavailable`, `data_loss` and for an error that is not a `ConnectError` |
| `exception.type` of the `exception` event of a `ConnectError` | the numeric Connect code (`"5"`) | `ConnectError` |
| `error.type` of an error whose class has no name | the empty string | the error's `name`, `_OTHER` if that is empty too |

The client span is unchanged: every code except `OK` still marks it `ERROR`.

What to update:

- Dashboards that plot streaming call duration will show larger values. Alerts and SLOs with a latency threshold that were tuned to the old, near-zero streaming values need new thresholds.
- Size panels that showed `0` start to show data. A size histogram of a streaming method is still `0`; use the `rpc.message` events (`recordMessages: true`) for per-message sizes.
- "Failed requests" computed from server spans with `status = error` now exclude the caller-class codes listed above. To count every non-OK answer, use `rpc.response.status_code != "OK"` or `error.type`, which are still recorded for those codes.
- A query that matches `exception.type` against a Connect code number must match `ConnectError` instead, and read the code from `error.type` or `rpc.response.status_code`.

Also in 1.3.0: a `filter` or `attributeFilter` that throws no longer fails the call; see [Callbacks that throw](/en/guide/observability/tracing#callbacks-that-throw).

## Cancellation spelling

A canceled call reports `rpc.response.status_code` and `error.type` as `CANCELED`, with one L: the spelling of the Connect protocol, Connect-ES, connect-go and `otelconnect-go`. `CANCELLED`, with two Ls, is the gRPC spelling and `@connectum/otel` never produces it. This is not a change of behavior, but a panel that reads data from both Connect and gRPC services should match both spellings, for example with the regular expression `CANCEL+ED`:

```text
rpc_response_status_code=~"CANCEL+ED"
```

## Verify

Make one call and read the exported span: it must carry `rpc.system.name`, a `rpc.method` containing `/`, and `rpc.response.status_code`, and no `rpc.service`. A successful call must show an unset status (not `OK`), and a call that fails must show `ERROR` with the error message.
