---
title: Reject Requests Before the Body Is Read
description: Use a server-wide request gate and per-message read limit to turn away unauthenticated or oversized requests cheaply, on HTTP and in-process alike.
docType: how-to
outline: deep
---

# Reject Requests Before the Body Is Read

Authentication interceptors run after the request message is available: for unary calls it has already been received and parsed. Two opt-in `createServer()` options reject a request earlier:

- `requestGate` runs once the request headers arrive, **before any request message is received, decompressed, or parsed**. Throw a `ConnectError` and the call ends without its body ever being read.
- `readMaxBytes` caps the size of each request message. A larger message ends the call with `resource_exhausted` before the handler runs.

Both are unset by default; a server that does not set them behaves exactly as before.

## Before you begin

- `@connectum/core` 1.3.0 or later (it requires `@connectrpc/connect` 2.2.0, which introduced `requestGate`).
- Decide what the gate may check. It sees only the call's `HandlerContext`: the service and method descriptors, the request headers, the deadline signal, and context values. It cannot see the request message.

## Configure a gate

Reject calls that carry no credential at all. The gate stays cheap: it only looks at a header. Full token verification stays in the [authentication interceptor](/en/guide/auth), which still runs for every admitted call.

```typescript
import { Code, ConnectError } from '@connectrpc/connect';
import { createServer } from '@connectum/core';

const server = createServer({
  services: [routes],
  requestGate: (context) => {
    if (!context.requestHeader.get('authorization')) {
      throw new ConnectError('unauthenticated', Code.Unauthenticated);
    }
  },
});
```

Return (or resolve) to admit the call. The gate may be `async`; the server awaits it.

### Throw client-safe errors only

A gate runs **before** the server interceptor chain, so `createErrorHandlerInterceptor()` never gets the chance to sanitise what it throws.

- A thrown `ConnectError` reaches the client exactly as thrown — code, message, metadata, and details. Give it a fixed, non-revealing message such as `unauthenticated` above. Do not throw a `ConnectError` whose message names internal rules (for example an authorization error that includes the rule that denied the call).
- Anything else — a plain `Error`, a string, a rejected promise — is replaced by Connect with `internal` / `internal error` on every protocol and both transports; its message, stack, and cause never reach the client. Connectum's tests pin this. It is a safety net, not a way to reject: the client learns nothing useful, so convert expected failures to a `ConnectError` with the right code.

### Audit rejections yourself

A rejected call never reaches the server interceptors, so `@connectum/otel` records no server span or metric for it and the logger interceptor writes nothing. Client-side interceptors of the caller still observe the failure. Connectum adds no automatic telemetry for the gate; wrap it when you need an audit trail:

```typescript
import type { HandlerContext } from '@connectrpc/connect';
import { Code, ConnectError } from '@connectrpc/connect';
import { createServer } from '@connectum/core';
import { metrics } from '@opentelemetry/api';

type Gate = (context: HandlerContext) => void | Promise<void>;

const rejections = metrics.getMeter('request-gate').createCounter('rpc.server.gate.rejections');

function audited(gate: Gate): Gate {
  return async (context) => {
    try {
      await gate(context);
    } catch (err) {
      rejections.add(1, {
        'rpc.service': context.service.typeName,
        'rpc.method': context.method.name,
        // Numeric Connect code, as @connectum/otel records it on spans.
        'rpc.connect_rpc.status_code': ConnectError.from(err).code,
      });
      throw err;
    }
  };
}

const credentialGate: Gate = (context) => {
  if (!context.requestHeader.get('authorization')) {
    throw new ConnectError('unauthenticated', Code.Unauthenticated);
  }
};

const server = createServer({ services: [routes], requestGate: audited(credentialGate) });
```

Time spent inside the gate is not part of any server span either; record it in the wrapper if you need it.

## Configure a read limit

```typescript
const server = createServer({
  services: [routes],
  readMaxBytes: 1024 * 1024, // 1 MiB per request message
});
```

A message exactly at the limit is accepted. The limit applies per message, so on a client-streaming or bidi call each message is checked separately. The value must be an integer from 1 to 4294967295 (Connect's maximum). `createServer()` throws a `RangeError` naming `readMaxBytes` for anything else — `0`, negatives, fractions, `NaN`, `Infinity` — and a `TypeError` for a non-number, so a misconfigured limit cannot silently turn into no limit.

## What the gate and the limit cover

### Both transports, no exemption

The gate and the limit apply identically over HTTP and in-process: `server.localClient()`, `server.client()` for a locally mounted service, `createLocalTransport()`, and `ctx.call` / `ctx.stream` to a local service. There is no exemption for in-process calls — see [In-process transport](/en/guide/production/in-process-transport#behavioural-parity-guarantees).

This matters for [`ctx.call`](/en/guide/service-communication/service-catalog): an internal call carries only the headers you forward. A credential gate rejects it unless the credential travels with it, via `propagateHeaders` or an outgoing interceptor:

```typescript
const server = createServer({
  services: [routes],
  catalog,
  requestGate: credentialGate,
  propagateHeaders: ['authorization'],
});
```

### Router RPCs yes, plain HTTP endpoints no

Every RPC registered on the server's router passes the gate, including RPCs contributed by protocols: gRPC Health and gRPC Reflection. A gRPC health probe therefore has to satisfy the gate.

HTTP endpoints served outside the router by a protocol's HTTP handler — for example `/healthz`, `/health`, and `/readyz` from `Healthcheck({ httpEnabled: true })` — do not pass the gate. A Kubernetes HTTP probe keeps working with a credential gate enabled.

### Server defaults, service overrides

Both options are **server-wide defaults**. A service that sets its own `requestGate` or `readMaxBytes` in its service options replaces the server value for that service only:

```typescript
const publicCatalog = defineService(CatalogService, handlers, {
  requestGate: () => {}, // admits everything; the server gate does not run here
  readMaxBytes: 16 * 1024 * 1024, // larger than the server default
});
```

::: warning The server gate is not a floor
Server and service values are not composed. A service gate replaces the server gate, and a larger service `readMaxBytes` raises the limit for that service. An options object that carries `requestGate: undefined` as an own key — for example after spreading a partially filled object — also removes the server gate for that service. Review service options when you rely on the server gate for security.
:::

### Cooperative cancellation

The server awaits a pending gate; it does not abandon it. A gate that waits on something slow should watch `context.signal` and throw when it aborts:

- the signal aborts when the call's deadline expires, when the client cancels, and when `server.stop()` begins shutdown;
- all three apply identically over HTTP and in-process.

### The in-process marker cannot be forged

In-process calls carry an internal transport marker header that the logger and OpenTelemetry use for attribution. On HTTP the server deletes that header from every request before Connect builds it, so neither a gate nor an interceptor can ever observe a forged value from a remote caller. Do not use the marker to exempt calls from a gate: it exists for attribution only.

## Verify

- Call a gated method without the credential over HTTP and through `server.localClient()`; both return `unauthenticated` with the message your gate threw, and the handler does not run.
- Send a message one byte over `readMaxBytes`; both transports return `resource_exhausted`. The diagnostic text may differ by transport — over HTTP it can include the observed size — but the code and the named limit are the same.
- For a parity check in tests, pass the same `requestGate` / `readMaxBytes` to [`transportParityTest()`](/en/contributing/parity-invariant); it applies them to both servers.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Internal `ctx.call` fails with `unauthenticated` | The gate applies to in-process calls, and the credential was not forwarded | Add the header to `propagateHeaders` or set it in an outgoing interceptor |
| One service ignores the server gate | Its service options set `requestGate` (possibly to `undefined`) | Remove the key, or have the service gate call the server gate |
| Rejections missing from traces and logs | Gate rejections run no server interceptor | Wrap the gate with an audit wrapper |
| gRPC health probe fails after enabling a gate | gRPC Health is a router RPC and is gated | Use the HTTP health endpoints for probes, or let the gate admit the health service |

## Learn / Configure / API reference

- **Learn:** [Auth and authz](/en/guide/auth) — what runs after the gate admits a call.
- **Configure:** [In-process transport](/en/guide/production/in-process-transport) — the parity guarantees the gate follows.
- **API reference:** [`CreateServerOptions`](/en/api/@connectum/core/types/interfaces/CreateServerOptions) (`requestGate`, `readMaxBytes`).
