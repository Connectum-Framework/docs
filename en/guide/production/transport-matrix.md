---
outline: deep
---

# Transport Matrix

Which RPC types work on which server transport. The Connect protocol states:
**"Bidirectional streaming requires HTTP/2, but the other RPC types also
support HTTP/1.1"** — a bidi service on an HTTP/1.1 transport does not fail
at startup by itself; the first client send simply hangs forever (or the
client receives `HTTP 505`). Connectum turns this into a startup diagnostic —
see [Startup validation](#startup-validation) below.

## Server transport modes

`createServer()` picks the transport from `tls` and `allowHTTP1`:

| Configuration | Transport | Node server |
|---|---|---|
| no `tls`, `allowHTTP1: true` (**default**) | plaintext HTTP/1.1 | `http.createServer` |
| no `tls`, `allowHTTP1: false` | plaintext HTTP/2 (h2c) | `http2.createServer` |
| `tls` configured | TLS + ALPN (HTTP/2 and HTTP/1.1 negotiated) | `http2.createSecureServer` |

## RPC type support

| Transport | Unary | Server streaming | Client streaming | Bidi streaming |
|---|---|---|---|---|
| Plaintext HTTP/1.1 (default) | ✅ | ✅ | ✅ | ❌ blocked at startup |
| Plaintext h2c (`allowHTTP1: false`) | ✅ | ✅ | ✅ | ✅ |
| TLS + ALPN, HTTP/2 negotiated | ✅ | ✅ | ✅ | ✅ |
| TLS + ALPN, **HTTP/1.1 negotiated** | ✅ | ✅ | ✅ | ❌ hangs at runtime |

::: warning Residual risk: TLS with an HTTP/1.1 client
A TLS server with `allowHTTP1: true` is *streaming-capable* (HTTP/2 is
negotiable), so startup validation does not hard-fail — but a client or
intermediary that negotiates HTTP/1.1 over TLS (a client without `h2` in its
ALPN list, a proxy with an HTTP/1.1 upstream leg) hits the same silent hang on
bidi calls. When bidi methods are present on such a server, Connectum logs a
**one-time warning** at startup. Remove the risk entirely by setting
`allowHTTP1: false` (the server then refuses HTTP/1.1 at ALPN, so HTTP/1.1
clients fail the handshake explicitly instead of hanging on bidi), or keep bidi
clients on HTTP/2 transports (`createGrpcTransport`, or `createConnectTransport`
with `httpVersion: "2"`). Silence the warning with `transportValidation: "off"`.
:::

::: tip Pure gRPC protocol needs HTTP/2 even for unary
The matrix above is for the **Connect protocol**. The classic gRPC protocol
(used by `grpcurl`, gRPC reflection clients, and `createGrpcTransport`)
requires HTTP/2 for *every* RPC type — on the default plaintext HTTP/1.1
server, gRPC clients and `grpcurl` do not work at all. Use h2c or TLS.
:::

## Serving gRPC and HTTP/1.1 on one **plaintext** port

A single **plaintext** (no-TLS) port cannot serve **both** native gRPC (which
needs HTTP/2 / h2c) **and** plain HTTP/1.1 clients. Per-connection protocol
selection is done by **ALPN**, a TLS handshake extension — a cleartext socket
has no handshake, so the server cannot tell an HTTP/1.1 request from the HTTP/2
connection preface. This is a **Node runtime limitation, not a Connectum one**:
Node core has declined to add cleartext `allowHTTP1`
([nodejs/node#26795](https://github.com/nodejs/node/issues/26795),
[#44887](https://github.com/nodejs/node/issues/44887) — both closed; maintainers
prescribe userland byte-sniffing), and `Upgrade: h2c` is deprecated by RFC 9113.
So `createServer()` offers `allowHTTP1: true` (HTTP/1.1 only) **or** `false`
(h2c only) on a plaintext port — never both.

This matters when a reverse proxy / API gateway that speaks **HTTP/1.1** (e.g.
[Ory Oathkeeper](https://www.ory.sh/oathkeeper/), nginx) fronts a service whose
internal peers use **native gRPC**. Resolve it with one of these, in order of
preference:

1. **Put a sidecar / edge proxy in front (recommended — runtime-agnostic).** A
   proxy that multiplexes protocols — [Envoy](https://www.envoyproxy.io/) or
   [Caddy](https://caddyserver.com/) — terminates the mixed edge and forwards a
   single protocol upstream. The proxy does the protocol detection the runtime
   cannot, and it works the same on **every** JS runtime (see the matrix below).
   See [Envoy Gateway](/en/guide/production/envoy-gateway) and
   [Service Mesh](/en/guide/production/service-mesh).
2. **Use TLS + ALPN.** A TLS server serves HTTP/1.1 and HTTP/2 on one port (ALPN
   negotiates per client). If app-level TLS is acceptable, this is the built-in
   mixed-port answer.
3. **Two listeners.** Serve native gRPC (h2c) and Connect/HTTP-1.1 on separate
   ports/roles. Lower complexity, but not one port.

::: tip Connect and gRPC-Web do not need any of this
Only **native gRPC** needs HTTP/2. The **Connect** and **gRPC-Web** protocols
run over HTTP/1.1, so the default plaintext HTTP/1.1 server already serves both —
a gateway that downgrades to HTTP/1.1 works for them with no extra setup.
:::

## Runtime support for native gRPC

Native gRPC depends on **HTTP/2 response trailers** (`grpc-status`). The
fetch-style `Response` used by Bun, Deno, and Cloudflare Workers carries no
trailers, so those `serve()` APIs **cannot serve native gRPC at all** — they
serve Connect and gRPC-Web (which fold trailers into the body) over HTTP/1.1.

| Runtime | Native gRPC server | Connect / gRPC-Web | gRPC + HTTP/1.1 on one plaintext port |
|---|---|---|---|
| **Node** (`node:http2` — what Connectum uses) | ✅ | ✅ | ❌ — use a sidecar proxy or TLS + ALPN |
| **Bun** (`Bun.serve`) | ❌ (no HTTP/2 trailers) | ✅ | ❌ |
| **Deno** (`Deno.serve`) | ❌ (no HTTP/2 trailers) | ✅ | ❌ |
| **Cloudflare Workers** | ❌ (edge-terminated, no raw ports) | ✅ (Connect / gRPC-Web) | ❌ (n/a) |

**Takeaway:** native gRPC is effectively a **Node** story; **Connect + gRPC-Web
over HTTP/1.1 work on every runtime**. If you develop or deploy on Bun / Deno /
Workers and must expose gRPC, terminate it at a **sidecar proxy** (Envoy / Caddy)
and let the runtime serve Connect / HTTP-1.1 — the proxy owns the protocol
multiplexing the runtime cannot do.

## Startup validation

When a registered service defines bidi-streaming methods and the effective
transport is plaintext HTTP/1.1, `server.start()` rejects with a
`TransportValidationError` carrying the stable code
`CONNECTUM_UNSUPPORTED_STREAMING_TRANSPORT`, the affected
`service.method` list, and both fixes:

```typescript
const server = createServer({
  services: [bidiRoutes],
  // no TLS + allowHTTP1 default → plaintext HTTP/1.1
});

await server.start();
// ✖ TransportValidationError [CONNECTUM_UNSUPPORTED_STREAMING_TRANSPORT]:
//   - acme.v1.ScannerService.StreamCodes (bidi_streaming)
//   Fix: allowHTTP1: false (h2c) or configure TLS.
```

Downgrade the check with `transportValidation: "warn"` (log once, start
anyway) or `"off"` — for example behind an HTTP/2-terminating proxy where the
bidi method is intentionally unused.

## Learn More

- [Security & TLS](/en/guide/security) — TLS configuration, mTLS
- [Server Configuration](/en/guide/server/configuration) — `createServer()` options
