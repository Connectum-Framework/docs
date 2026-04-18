[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [logger](../index.md) / Logger

# Interface: Logger

Defined in: [packages/otel/src/logger.ts:11](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/otel/src/logger.ts#L11)

## Methods

### debug()

> **debug**(`message`, `attributes?`): `void`

Defined in: [packages/otel/src/logger.ts:15](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/otel/src/logger.ts#L15)

#### Parameters

##### message

`string`

##### attributes?

`AnyValueMap`

#### Returns

`void`

***

### emit()

> **emit**(`record`): `void`

Defined in: [packages/otel/src/logger.ts:16](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/otel/src/logger.ts#L16)

#### Parameters

##### record

`LogRecord`

#### Returns

`void`

***

### error()

> **error**(`message`, `attributes?`): `void`

Defined in: [packages/otel/src/logger.ts:14](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/otel/src/logger.ts#L14)

#### Parameters

##### message

`string`

##### attributes?

`AnyValueMap`

#### Returns

`void`

***

### info()

> **info**(`message`, `attributes?`): `void`

Defined in: [packages/otel/src/logger.ts:12](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/otel/src/logger.ts#L12)

#### Parameters

##### message

`string`

##### attributes?

`AnyValueMap`

#### Returns

`void`

***

### warn()

> **warn**(`message`, `attributes?`): `void`

Defined in: [packages/otel/src/logger.ts:13](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/otel/src/logger.ts#L13)

#### Parameters

##### message

`string`

##### attributes?

`AnyValueMap`

#### Returns

`void`
