[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / NormalizedSpan

# Interface: NormalizedSpan

Defined in: [testing/src/otel-collectors.ts:34](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/otel-collectors.ts#L34)

Structural, transport-agnostic representation of a span suitable for `deepEqual`.

## Properties

### attributes

> **attributes**: `Record`\<`string`, `unknown`\>

Defined in: [testing/src/otel-collectors.ts:37](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/otel-collectors.ts#L37)

***

### events

> **events**: `object`[]

Defined in: [testing/src/otel-collectors.ts:38](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/otel-collectors.ts#L38)

#### attributes

> **attributes**: `Record`\<`string`, `unknown`\>

#### name

> **name**: `string`

***

### kind

> **kind**: `number`

Defined in: [testing/src/otel-collectors.ts:36](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/otel-collectors.ts#L36)

***

### name

> **name**: `string`

Defined in: [testing/src/otel-collectors.ts:35](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/otel-collectors.ts#L35)

***

### parentSpanId

> **parentSpanId**: `string` \| `undefined`

Defined in: [testing/src/otel-collectors.ts:42](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/otel-collectors.ts#L42)

***

### spanId

> **spanId**: `string`

Defined in: [testing/src/otel-collectors.ts:41](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/otel-collectors.ts#L41)

***

### status

> **status**: `object`

Defined in: [testing/src/otel-collectors.ts:39](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/otel-collectors.ts#L39)

#### code

> **code**: `number`

#### message

> **message**: `string` \| `undefined`

***

### traceId

> **traceId**: `string`

Defined in: [testing/src/otel-collectors.ts:40](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/testing/src/otel-collectors.ts#L40)
