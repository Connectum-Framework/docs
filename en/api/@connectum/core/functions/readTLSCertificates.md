[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / readTLSCertificates

# Function: readTLSCertificates()

> **readTLSCertificates**(`options?`): `object`

Defined in: [packages/core/src/TLSConfig.ts:42](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/TLSConfig.ts#L42)

Read TLS certificates from configuration

Explicit keyPath and certPath are used when both are non-empty. When neither
is, both files come from dirPath or getTLSPath(). Exactly one of them is a
configuration error: falling back to the directory would start the server
with a certificate other than the one the operator named.

## Parameters

### options?

[`TLSOptions`](../types/interfaces/TLSOptions.md) = `{}`

TLS options

## Returns

`object`

TLS key and cert buffers

### cert

> **cert**: `Buffer`

### key

> **key**: `Buffer`

## Throws

When only one of keyPath and certPath is non-empty; thrown before any file is read
