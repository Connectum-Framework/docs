[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / TLSOptions

# Interface: TLSOptions

Defined in: [packages/core/src/types.ts:98](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/core/src/types.ts#L98)

TLS configuration options

## Properties

### certPath?

> `optional` **certPath**: `string`

Defined in: [packages/core/src/types.ts:107](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/core/src/types.ts#L107)

Path to TLS certificate file

***

### dirPath?

> `optional` **dirPath**: `string`

Defined in: [packages/core/src/types.ts:113](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/core/src/types.ts#L113)

TLS directory path (alternative to keyPath/certPath)
Will look for server.key and server.crt in this directory

***

### keyPath?

> `optional` **keyPath**: `string`

Defined in: [packages/core/src/types.ts:102](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/core/src/types.ts#L102)

Path to TLS key file
