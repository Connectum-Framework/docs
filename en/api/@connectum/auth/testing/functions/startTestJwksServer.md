[Connectum API Reference](../../../../index.md) / [@connectum/auth](../../index.md) / [testing](../index.md) / startTestJwksServer

# Function: startTestJwksServer()

> **startTestJwksServer**(`jwks`): `Promise`\<[`TestJwksServer`](../interfaces/TestJwksServer.md)\>

Defined in: [packages/auth/src/testing/test-jwt-rs256.ts:95](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/testing/test-jwt-rs256.ts#L95)

Start an ephemeral in-process JWKS server publishing the given public JWK(s)
at `/.well-known/jwks.json` on a random loopback port.

## Parameters

### jwks

`JWK` \| readonly `JWK`[]

One public JWK or an array (from [generateRsaTestKeypair](generateRsaTestKeypair.md)).

## Returns

`Promise`\<[`TestJwksServer`](../interfaces/TestJwksServer.md)\>
