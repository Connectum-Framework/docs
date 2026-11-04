[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / TLSOptions

# Interface: TLSOptions

Defined in: [packages/core/src/types.ts:193](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L193)

TLS configuration options.
Supply both explicit key and certificate paths or use a directory pair.
A single explicit path is a configuration error: it is rejected before any
file is read instead of being replaced by the directory files.
A file that cannot be read or parsed fails startup with an error that names the
file and the setting its path came from.

## Properties

### certPath?

> `optional` **certPath?**: `string`

Defined in: [packages/core/src/types.ts:202](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L202)

Path to TLS certificate file

***

### dirPath?

> `optional` **dirPath?**: `string`

Defined in: [packages/core/src/types.ts:208](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L208)

TLS directory path (alternative to keyPath/certPath)
Will look for server.key and server.crt in this directory

***

### keyPath?

> `optional` **keyPath?**: `string`

Defined in: [packages/core/src/types.ts:197](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L197)

Path to TLS key file
