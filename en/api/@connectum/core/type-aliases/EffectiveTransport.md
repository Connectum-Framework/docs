[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / EffectiveTransport

# Type Alias: EffectiveTransport

> **EffectiveTransport** = `object`

Defined in: [packages/core/src/TransportValidation.ts:54](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/TransportValidation.ts#L54)

Effective transport resolved from `tls` + `allowHTTP1`.

- `plaintext-h1` — no TLS, `allowHTTP1: true` (default): HTTP/1.1 only.
- `h2c` — no TLS, `allowHTTP1: false`: plaintext HTTP/2.
- `tls-h1-negotiable` — TLS, `allowHTTP1: true`: ALPN offers both; a client
  may negotiate HTTP/1.1 (residual bidi risk).
- `tls-h2-only` — TLS, `allowHTTP1: false`: ALPN refuses HTTP/1.1.

## Properties

### H2C

> `readonly` **H2C**: `"h2c"` = `"h2c"`

Defined in: [packages/core/src/TransportValidation.ts:56](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/TransportValidation.ts#L56)

***

### PLAINTEXT\_H1

> `readonly` **PLAINTEXT\_H1**: `"plaintext-h1"` = `"plaintext-h1"`

Defined in: [packages/core/src/TransportValidation.ts:55](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/TransportValidation.ts#L55)

***

### TLS\_H1\_NEGOTIABLE

> `readonly` **TLS\_H1\_NEGOTIABLE**: `"tls-h1-negotiable"` = `"tls-h1-negotiable"`

Defined in: [packages/core/src/TransportValidation.ts:57](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/TransportValidation.ts#L57)

***

### TLS\_H2\_ONLY

> `readonly` **TLS\_H2\_ONLY**: `"tls-h2-only"` = `"tls-h2-only"`

Defined in: [packages/core/src/TransportValidation.ts:58](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/TransportValidation.ts#L58)
