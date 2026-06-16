[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / StreamingMethodInfo

# Interface: StreamingMethodInfo

Defined in: [packages/core/src/TransportValidation.ts:76](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/src/TransportValidation.ts#L76)

A streaming method that requires HTTP/2.

## Properties

### kind

> `readonly` **kind**: `string`

Defined in: [packages/core/src/TransportValidation.ts:82](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/src/TransportValidation.ts#L82)

Streaming kind: `bidi_streaming`.

***

### method

> `readonly` **method**: `string`

Defined in: [packages/core/src/TransportValidation.ts:80](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/src/TransportValidation.ts#L80)

Method name (e.g. `StreamCodes`).

***

### service

> `readonly` **service**: `string`

Defined in: [packages/core/src/TransportValidation.ts:78](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/src/TransportValidation.ts#L78)

Fully qualified service typeName (e.g. `acme.v1.ScannerService`).
