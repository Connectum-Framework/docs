[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [attributes](../index.md) / ConnectErrorCodeName

# Variable: ConnectErrorCodeName

> `const` **ConnectErrorCodeName**: `Record`\<`number`, `string`\>

Defined in: [attributes.ts:101](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/attributes.ts#L101)

Reverse map: numeric code -> string name for span attributes

Code 1 is spelled `CANCELED` (one L), as the Connect protocol, Connect-ES,
connect-go and otelconnect-go spell it. `CANCELLED` (two Ls) is the gRPC
spelling and is never produced. Queries that must match data written by
both stacks can use the pattern `CANCEL+ED`.
