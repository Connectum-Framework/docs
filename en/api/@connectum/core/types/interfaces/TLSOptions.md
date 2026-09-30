[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / TLSOptions

# Interface: TLSOptions

Defined in: [packages/core/src/types.ts:134](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L134)

TLS configuration options

## Properties

### certPath?

> `optional` **certPath?**: `string`

Defined in: [packages/core/src/types.ts:143](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L143)

Path to TLS certificate file

***

### dirPath?

> `optional` **dirPath?**: `string`

Defined in: [packages/core/src/types.ts:149](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L149)

TLS directory path (alternative to keyPath/certPath)
Will look for server.key and server.crt in this directory

***

### keyPath?

> `optional` **keyPath?**: `string`

Defined in: [packages/core/src/types.ts:138](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L138)

Path to TLS key file
