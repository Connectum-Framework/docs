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
fetch-style `Response` used by `Bun.serve`, `Deno.serve`, and Cloudflare Workers
carries no trailers, so those `serve()` APIs **cannot serve native gRPC at all** —
they serve Connect and gRPC-Web (which fold trailers into the body) over HTTP/1.1.
Connectum does not use them: `createServer()` builds on `node:http2`.

| Runtime | Native gRPC server | Connect / gRPC-Web | gRPC + HTTP/1.1 on one plaintext port |
|---|---|---|---|
| **Node** (`node:http2` — what Connectum uses) | ✅ | ✅ | ❌ — use a sidecar proxy or TLS + ALPN |
| **Bun** (`node:http2` — what Connectum uses) | ✅ | ✅ | ❌ |
| **Bun** (`Bun.serve`) | ❌ (no HTTP/2 trailers)* | ✅ | ❌ |
| **Deno** (`Deno.serve`) | ❌ (no HTTP/2 trailers) | ✅ | ❌ |
| **Cloudflare Workers** | ❌ (edge-terminated, no raw ports) | ✅ (Connect / gRPC-Web) | ❌ (n/a) |

\* `Bun.serve` and `Deno.serve` are marked from their fetch-style `Response` API, which
carries no trailers -- Connectum does not build on them, so this project has not executed
that case. Everything Connectum *does* use is covered in
[Verified behaviour by runtime](#verified).

**Takeaway:** the fetch-style `serve()` APIs cannot host native gRPC, but that
does not apply to a Connectum server on Bun: `createServer()` builds on
`node:http2`, whose server side delivers trailers on Bun as well — including
plaintext h2c. **Connect + gRPC-Web over HTTP/1.1 work on every runtime.** If you
deploy on Deno / Workers, or write your own `Bun.serve` handler, and must expose
gRPC, terminate it at a **sidecar proxy** (Envoy / Caddy) and let the runtime
serve Connect / HTTP-1.1 — the proxy owns the protocol multiplexing the runtime
cannot do.

::: tip Bun client versions
Serving is unaffected on every Bun version, but Bun's `node:http2` **client** only
became usable in **Bun 1.2.6** — see
[Runtime Compatibility](/en/guide/runtime-compatibility#http2-client).
:::

## Verified behaviour by runtime {#verified}

The tables above describe intent. This one records what was **executed**, so you can tell
a tested guarantee from a reasonable expectation. Every row was run against a Connectum
server built by `createServer()`, with `@connectum/core` 1.2.0 and
`@connectrpc/connect-node` (both 2.0.0 and 2.1.2), asserting the response payload and the
gRPC status code -- not merely that a call did not throw. Each scenario ran three times.

### Server side -- `createServer()`

| Runtime | Plaintext HTTP/1.1 (default) | Plaintext h2c (`allowHTTP1: false`) |
|---|---|---|
| **Node.js** | Connect unary ✅ · server streaming ✅ · error status ✅ · native gRPC ❌ (needs HTTP/2) · bidi ❌ refused at startup | unary ✅ · server streaming ✅ · bidi ✅ · gRPC status in trailers ✅ |
| **Bun** (1.1.38 and up) | identical to Node.js, including the startup refusal | unary ✅ · server streaming ✅ · bidi ✅ · gRPC status in trailers ✅ |

The startup refusal was run on both runtimes: a service with a bidi method on
`allowHTTP1: true` rejects `server.start()` with
`CONNECTUM_UNSUPPORTED_STREAMING_TRANSPORT` rather than starting and hanging on the first
send.

**Serving was never the Bun problem.** A Connectum h2c server under Bun delivers HTTP/2
trailers in both directions -- verified down to Bun 1.1.38, including an error whose
`grpc-status` arrives only in the trailer. This is because `createServer()` builds on
`node:http2`; it is not affected by what `Bun.serve` can or cannot do.

### Client side -- `@connectrpc/connect-node`

| Runtime | `createGrpcTransport` / `createConnectTransport({httpVersion:'2'})` | `createConnectTransport()` (HTTP/1.1) |
|---|---|---|
| **Node.js** | unary ✅ · server streaming ✅ · bidi ✅ · trailers ✅ | unary ✅ · server streaming ✅ · bidi ❌ (protocol) |
| **Bun <= 1.2.5** | ❌ **first RPC hangs** -- the transport is constructed without error, the call never completes, nothing is thrown | unary ✅ · server streaming ✅ · bidi ❌ (protocol) |
| **Bun >= 1.2.6** | unary ✅ · server streaming ✅ · bidi ✅ · trailers ✅ | unary ✅ · server streaming ✅ · bidi ❌ (protocol) |

The Bun boundary was located by bisection over 1.1.38, 1.2.0, 1.2.5, 1.2.6, 1.2.7, 1.2.8,
1.2.9, 1.2.10, 1.2.15, 1.2.21, 1.3.0 and 1.3.13: **1.2.5 hangs, 1.2.6 passes**, and every
later version passes. Bun 1.2.6 rewrote the `node:http2` client.

::: warning A hang, not an error
Earlier revisions of these docs described this as a `TypeError`. That symptom was **not
reproducible on any tested combination**. What actually happens is worse to diagnose: the
call simply never settles, so a service waits forever rather than failing fast. If you are
pinned below Bun 1.2.6 and see a request that never returns, this is the first thing to
check.
:::

### The two limitations are different in kind

| | Node.js | Bun |
|---|---|---|
| **What** | one plaintext port serves HTTP/1.1 **or** h2c, never both | the `node:http2` client was unusable |
| **Why** | protocol selection needs ALPN, which is a TLS handshake extension; a cleartext socket has no handshake | incomplete `node:http2` implementation |
| **Scope** | server side | client side only |
| **Status** | **permanent** -- Node core declined it ([#26795](https://github.com/nodejs/node/issues/26795), [#44887](https://github.com/nodejs/node/issues/44887), both closed) and `Upgrade: h2c` is deprecated by RFC 9113 | **fixed** in Bun 1.2.6 |
| **Work around it by** | TLS + ALPN, or a sidecar proxy | upgrading Bun |

Bidi streaming over HTTP/1.1 is a third thing again: impossible on **every** runtime,
because HTTP/1.1 has no full duplex. That is why Connectum refuses to start rather than
letting it hang -- see [Startup validation](#startup-validation).

### Not tested

Stated so the table above is not read as broader than it is:

- **TLS + ALPN under Bun.** Every run above was plaintext (h2c or HTTP/1.1).
- **Bun below 1.1.38**, and the `Bun.serve` API, which Connectum does not use.
- **`@connectrpc/connect-node` 1.x** (protobuf-es v1). Only 2.x was exercised, so the
  original `TypeError` report cannot be disproved for that generation.

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
