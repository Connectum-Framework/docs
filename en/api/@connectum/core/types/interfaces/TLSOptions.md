[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / TLSOptions

# Interface: TLSOptions

Defined in: [packages/core/src/types.ts:154](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L154)

TLS configuration options.
Supply both explicit key and certificate paths or use a directory pair.
A single explicit path is ignored: both files are then read from the directory.

## Properties

### certPath?

> `optional` **certPath?**: `string`

Defined in: [packages/core/src/types.ts:163](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L163)

Path to TLS certificate file

***

### dirPath?

> `optional` **dirPath?**: `string`

Defined in: [packages/core/src/types.ts:169](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L169)

TLS directory path (alternative to keyPath/certPath)
Will look for server.key and server.crt in this directory

***

### keyPath?

> `optional` **keyPath?**: `string`

Defined in: [packages/core/src/types.ts:158](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L158)

Path to TLS key file
