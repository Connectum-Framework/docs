[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / NormalizedSpan

# Interface: NormalizedSpan

Defined in: testing/src/otel-collectors.ts:34

Structural, transport-agnostic representation of a span suitable for `deepEqual`.

## Properties

### attributes

> **attributes**: `Record`\<`string`, `unknown`\>

Defined in: testing/src/otel-collectors.ts:37

***

### events

> **events**: `object`[]

Defined in: testing/src/otel-collectors.ts:38

#### attributes

> **attributes**: `Record`\<`string`, `unknown`\>

#### name

> **name**: `string`

***

### kind

> **kind**: `number`

Defined in: testing/src/otel-collectors.ts:36

***

### name

> **name**: `string`

Defined in: testing/src/otel-collectors.ts:35

***

### parentSpanId

> **parentSpanId**: `string` \| `undefined`

Defined in: testing/src/otel-collectors.ts:42

***

### spanId

> **spanId**: `string`

Defined in: testing/src/otel-collectors.ts:41

***

### status

> **status**: `object`

Defined in: testing/src/otel-collectors.ts:39

#### code

> **code**: `number`

#### message

> **message**: `string` \| `undefined`

***

### traceId

> **traceId**: `string`

Defined in: testing/src/otel-collectors.ts:40
