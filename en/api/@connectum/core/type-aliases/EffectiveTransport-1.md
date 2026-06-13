[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / EffectiveTransport

# Type Alias: EffectiveTransport

> **EffectiveTransport** = *typeof* [`EffectiveTransport`](EffectiveTransport.md)\[keyof *typeof* [`EffectiveTransport`](EffectiveTransport.md)\]

Defined in: [packages/core/src/TransportValidation.ts:54](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/TransportValidation.ts#L54)

Effective transport resolved from `tls` + `allowHTTP1`.

- `plaintext-h1` — no TLS, `allowHTTP1: true` (default): HTTP/1.1 only.
- `h2c` — no TLS, `allowHTTP1: false`: plaintext HTTP/2.
- `tls-h1-negotiable` — TLS, `allowHTTP1: true`: ALPN offers both; a client
  may negotiate HTTP/1.1 (residual bidi risk).
- `tls-h2-only` — TLS, `allowHTTP1: false`: ALPN refuses HTTP/1.1.
