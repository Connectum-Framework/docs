---
title: RPC Telemetry Attribute Names
description: From 1.3.0, @connectum/otel names RPC span and metric attributes after the current OpenTelemetry RPC conventions; update dashboards, alerts and code that import the old constants.
docType: migration
---

# RPC Telemetry Attribute Names

> Applies to 1.3.0.

## Does this apply to you?

You need to act only if **any** of these is true:

- a dashboard, alert, recording rule or query filters or groups on `rpc.system`, `rpc.service`, `rpc.method` or `rpc.connect_rpc.status_code` (Prometheus labels `rpc_system`, `rpc_service`, `rpc_method`, `rpc_connect_rpc_status_code`);
- a span processor, sampler or `attributeFilter` reads those attributes from spans created by `@connectum/otel`;
- your code imports `ATTR_RPC_SYSTEM`, `ATTR_RPC_SERVICE`, `ATTR_RPC_CONNECT_RPC_STATUS_CODE` or `RPC_SYSTEM_CONNECT_RPC` from `@connectum/otel`.

If you only export telemetry to a backend and look at traces by service and method, nothing breaks: the span name did not change.

## What changed

The server and client interceptors now use the attribute names of the OpenTelemetry RPC conventions for Connect:

| Before | From 1.3.0 |
|--------|------------|
| `rpc.system` = `connect_rpc` | `rpc.system.name` = `connectrpc` |
| `rpc.service` = `acme.v1.Greeter` and `rpc.method` = `SayHello` | `rpc.method` = `acme.v1.Greeter/SayHello` (equal to the span name); `rpc.service` is gone |
| `rpc.connect_rpc.status_code` = `5` (number, failed calls only) | `rpc.response.status_code` = `NOT_FOUND` (string; `OK` after a successful unary call) |
| `error.type` = `NOT_FOUND` | unchanged; on a Connect error it equals `rpc.response.status_code` |

A streaming call that started successfully carries no `rpc.response.status_code`, because its final status is not known when the response head returns; a failure still sets it.

`ATTR_RPC_SYSTEM`, `ATTR_RPC_SERVICE`, `ATTR_RPC_CONNECT_RPC_STATUS_CODE` and `RPC_SYSTEM_CONNECT_RPC` are removed. Use `ATTR_RPC_SYSTEM_NAME`, `ATTR_RPC_RESPONSE_STATUS_CODE` and `RPC_SYSTEM_NAME_CONNECTRPC`. `getLogger()` now names a logger after the service part of `rpc.method`.

Not changed: the `rpc.{server,client}.{request,response}.size` histograms and the `rpc.message` span events. The conventions define no replacement; they stay as Connectum-specific telemetry, and `rpc.message` events remain off unless you set `recordMessages: true`.

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

## Verify

Make one call and read the exported span: it must carry `rpc.system.name`, a `rpc.method` containing `/`, and `rpc.response.status_code`, and no `rpc.service`.
