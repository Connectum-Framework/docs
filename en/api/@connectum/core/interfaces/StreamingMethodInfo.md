[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / StreamingMethodInfo

# Interface: StreamingMethodInfo

Defined in: [packages/core/src/TransportValidation.ts:77](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/TransportValidation.ts#L77)

A streaming method that requires HTTP/2.

## Properties

### kind

> `readonly` **kind**: `string`

Defined in: [packages/core/src/TransportValidation.ts:83](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/TransportValidation.ts#L83)

Streaming kind: `bidi_streaming`.

***

### method

> `readonly` **method**: `string`

Defined in: [packages/core/src/TransportValidation.ts:81](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/TransportValidation.ts#L81)

Method name (e.g. `StreamCodes`).

***

### service

> `readonly` **service**: `string`

Defined in: [packages/core/src/TransportValidation.ts:79](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/TransportValidation.ts#L79)

Fully qualified service typeName (e.g. `acme.v1.ScannerService`).
