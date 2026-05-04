[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / TLSOptions

# Interface: TLSOptions

Defined in: [packages/core/src/types.ts:98](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L98)

TLS configuration options

## Properties

### certPath?

> `optional` **certPath?**: `string`

Defined in: [packages/core/src/types.ts:107](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L107)

Path to TLS certificate file

***

### dirPath?

> `optional` **dirPath?**: `string`

Defined in: [packages/core/src/types.ts:113](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L113)

TLS directory path (alternative to keyPath/certPath)
Will look for server.key and server.crt in this directory

***

### keyPath?

> `optional` **keyPath?**: `string`

Defined in: [packages/core/src/types.ts:102](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L102)

Path to TLS key file
