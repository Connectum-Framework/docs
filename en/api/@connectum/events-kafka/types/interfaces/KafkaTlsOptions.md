[Connectum API Reference](../../../../index.md) / [@connectum/events-kafka](../../index.md) / [types](../index.md) / KafkaTlsOptions

# Interface: KafkaTlsOptions

Defined in: [types.ts:11](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L11)

TLS settings of the broker connection. Further `tls.connect` options go through [KafkaAdapterOptions.clientOptions](KafkaAdapterOptions.md#clientoptions).

## Properties

### ca?

> `readonly` `optional` **ca?**: `string` \| `Uint8Array`\<`ArrayBufferLike`\> \| readonly (`string` \| `Uint8Array`\<`ArrayBufferLike`\>)[]

Defined in: [types.ts:13](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L13)

Trusted certificate authorities (PEM).

***

### cert?

> `readonly` `optional` **cert?**: `string` \| `Uint8Array`\<`ArrayBufferLike`\> \| readonly (`string` \| `Uint8Array`\<`ArrayBufferLike`\>)[]

Defined in: [types.ts:15](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L15)

Client certificate chain (PEM) for mutual TLS.

***

### key?

> `readonly` `optional` **key?**: `string` \| `Uint8Array`\<`ArrayBufferLike`\> \| readonly (`string` \| `Uint8Array`\<`ArrayBufferLike`\>)[]

Defined in: [types.ts:17](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L17)

Client private key (PEM) for mutual TLS.

***

### passphrase?

> `readonly` `optional` **passphrase?**: `string`

Defined in: [types.ts:19](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L19)

Passphrase of the private key.

***

### rejectUnauthorized?

> `readonly` `optional` **rejectUnauthorized?**: `boolean`

Defined in: [types.ts:21](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L21)

Whether the server certificate must verify (default: true). Turning it off removes the protection TLS gives.

***

### servername?

> `readonly` `optional` **servername?**: `string`

Defined in: [types.ts:23](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L23)

Server name for SNI and certificate verification when it differs from the broker address.
