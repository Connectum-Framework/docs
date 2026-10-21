[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / buildSuccessAttributes

# Function: buildSuccessAttributes()

> **buildSuccessAttributes**(): `Record`\<`string`, `string`\>

Defined in: [shared.ts:201](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/shared.ts#L201)

Attributes of a successfully completed unary call: `rpc.response.status_code="OK"`.
`error.type` is deliberately absent, the convention forbids it on success.

## Returns

`Record`\<`string`, `string`\>
