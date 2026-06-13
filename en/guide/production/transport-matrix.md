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
