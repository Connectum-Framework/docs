[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / TLSOptions

# Interface: TLSOptions

Defined in: [packages/core/src/types.ts:155](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L155)

TLS configuration options.
Supply both explicit key and certificate paths or use a directory pair.
A single explicit path is a configuration error: it is rejected before any
file is read instead of being replaced by the directory files.

## Properties

### certPath?

> `optional` **certPath?**: `string`

Defined in: [packages/core/src/types.ts:164](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L164)

Path to TLS certificate file

***

### dirPath?

> `optional` **dirPath?**: `string`

Defined in: [packages/core/src/types.ts:170](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L170)

TLS directory path (alternative to keyPath/certPath)
Will look for server.key and server.crt in this directory

***

### keyPath?

> `optional` **keyPath?**: `string`

Defined in: [packages/core/src/types.ts:159](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L159)

Path to TLS key file
