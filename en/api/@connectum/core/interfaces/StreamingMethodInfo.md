[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / StreamingMethodInfo

# Interface: StreamingMethodInfo

Defined in: [packages/core/src/TransportValidation.ts:76](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/TransportValidation.ts#L76)

A streaming method that requires HTTP/2.

## Properties

### kind

> `readonly` **kind**: `string`

Defined in: [packages/core/src/TransportValidation.ts:82](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/TransportValidation.ts#L82)

Streaming kind: `bidi_streaming`.

***

### method

> `readonly` **method**: `string`

Defined in: [packages/core/src/TransportValidation.ts:80](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/TransportValidation.ts#L80)

Method name (e.g. `StreamCodes`).

***

### service

> `readonly` **service**: `string`

Defined in: [packages/core/src/TransportValidation.ts:78](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/TransportValidation.ts#L78)

Fully qualified service typeName (e.g. `acme.v1.ScannerService`).
