[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / EffectiveTransport

# Variable: EffectiveTransport

> `const` **EffectiveTransport**: `object`

Defined in: [packages/core/src/TransportValidation.ts:54](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/src/TransportValidation.ts#L54)

Effective transport resolved from `tls` + `allowHTTP1`.

- `plaintext-h1` — no TLS, `allowHTTP1: true` (default): HTTP/1.1 only.
- `h2c` — no TLS, `allowHTTP1: false`: plaintext HTTP/2.
- `tls-h1-negotiable` — TLS, `allowHTTP1: true`: ALPN offers both; a client
  may negotiate HTTP/1.1 (residual bidi risk).
- `tls-h2-only` — TLS, `allowHTTP1: false`: ALPN refuses HTTP/1.1.

## Type Declaration

### H2C

> `readonly` **H2C**: `"h2c"` = `"h2c"`

### PLAINTEXT\_H1

> `readonly` **PLAINTEXT\_H1**: `"plaintext-h1"` = `"plaintext-h1"`

### TLS\_H1\_NEGOTIABLE

> `readonly` **TLS\_H1\_NEGOTIABLE**: `"tls-h1-negotiable"` = `"tls-h1-negotiable"`

### TLS\_H2\_ONLY

> `readonly` **TLS\_H2\_ONLY**: `"tls-h2-only"` = `"tls-h2-only"`
