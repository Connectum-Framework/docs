[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [attributes](../index.md) / ATTR\_RPC\_RESPONSE\_STATUS\_CODE

# Variable: ATTR\_RPC\_RESPONSE\_STATUS\_CODE

> `const` **ATTR\_RPC\_RESPONSE\_STATUS\_CODE**: `"rpc.response.status_code"` = `"rpc.response.status_code"`

Defined in: [attributes.ts:25](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/attributes.ts#L25)

Status of the call as a string: the Connect error-code name (`NOT_FOUND`) on failure and
`OK` on a successful unary call. Not set on a streaming call that has started successfully,
because the final status is not known when the response head is returned.
