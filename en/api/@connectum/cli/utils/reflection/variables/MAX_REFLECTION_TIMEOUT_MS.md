[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [utils/reflection](../index.md) / MAX\_REFLECTION\_TIMEOUT\_MS

# Variable: MAX\_REFLECTION\_TIMEOUT\_MS

> `const` **MAX\_REFLECTION\_TIMEOUT\_MS**: `99999999` = `99_999_999`

Defined in: [utils/reflection.ts:52](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/utils/reflection.ts#L52)

Largest time limit that can be sent: the Connect client puts the deadline into the
`grpc-timeout` header in milliseconds only, and the header value is at most eight decimal
digits, so 99 999 999 ms (about 27.8 hours) is the longest limit a server accepts. A longer
value is refused by the server as an invalid header.
