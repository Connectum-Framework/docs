[Connectum API Reference](../../../../index.md) / [@connectum/events-kafka](../../index.md) / [types](../index.md) / KafkaSaslOptions

# Type Alias: KafkaSaslOptions

> **KafkaSaslOptions** = \{ `mechanism`: `"plain"` \| `"scram-sha-256"` \| `"scram-sha-512"`; `password`: `string`; `username`: `string`; \} \| \{ `mechanism`: `"oauthbearer"`; `oauthBearerProvider`: () => `Promise`\<\{ `value`: `string`; \}\>; \} \| \{ `accessKeyId`: `string`; `authorizationIdentity`: `string`; `mechanism`: `"aws"`; `secretAccessKey`: `string`; `sessionToken?`: `string`; \}

Defined in: [types.ts:27](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L27)

SASL authentication of the broker connection.

## Union Members

### Type Literal

\{ `mechanism`: `"plain"` \| `"scram-sha-256"` \| `"scram-sha-512"`; `password`: `string`; `username`: `string`; \}

***

### Type Literal

\{ `mechanism`: `"oauthbearer"`; `oauthBearerProvider`: () => `Promise`\<\{ `value`: `string`; \}\>; \}

#### mechanism

> `readonly` **mechanism**: `"oauthbearer"`

#### oauthBearerProvider

> `readonly` **oauthBearerProvider**: () => `Promise`\<\{ `value`: `string`; \}\>

Called for a fresh token whenever the connection authenticates; resolves to the bearer token.

##### Returns

`Promise`\<\{ `value`: `string`; \}\>

***

### Type Literal

\{ `accessKeyId`: `string`; `authorizationIdentity`: `string`; `mechanism`: `"aws"`; `secretAccessKey`: `string`; `sessionToken?`: `string`; \}
