[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / TLSOptions

# Interface: TLSOptions

Defined in: [packages/core/src/types.ts:152](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L152)

TLS configuration options

## Properties

### certPath?

> `optional` **certPath?**: `string`

Defined in: [packages/core/src/types.ts:161](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L161)

Path to TLS certificate file

***

### dirPath?

> `optional` **dirPath?**: `string`

Defined in: [packages/core/src/types.ts:167](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L167)

TLS directory path (alternative to keyPath/certPath)
Will look for server.key and server.crt in this directory

***

### keyPath?

> `optional` **keyPath?**: `string`

Defined in: [packages/core/src/types.ts:156](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L156)

Path to TLS key file
