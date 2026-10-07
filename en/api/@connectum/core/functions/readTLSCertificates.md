[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / readTLSCertificates

# Function: readTLSCertificates()

> **readTLSCertificates**(`options?`): `object`

Defined in: [packages/core/src/TLSConfig.ts:40](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/TLSConfig.ts#L40)

Read TLS certificates from configuration

Explicit keyPath and certPath are used only when both are non-empty.
Otherwise both files come from dirPath or getTLSPath(); a lone explicit
path does not override either directory-based file.

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
