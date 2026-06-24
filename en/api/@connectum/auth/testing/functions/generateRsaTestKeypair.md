[Connectum API Reference](../../../../index.md) / [@connectum/auth](../../index.md) / [testing](../index.md) / generateRsaTestKeypair

# Function: generateRsaTestKeypair()

> **generateRsaTestKeypair**(`kid?`): `Promise`\<[`RsaTestKeypair`](../interfaces/RsaTestKeypair.md)\>

Defined in: [packages/auth/src/testing/test-jwt-rs256.ts:73](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/testing/test-jwt-rs256.ts#L73)

Generate an RSA (RS256) test keypair and the matching public JWK.

The returned `publicJwk` carries the `kid`/`alg`/`use` a JWKS endpoint
publishes, and the same `kid` must be set on every token minted for it
(otherwise `createRemoteJWKSet` fails key selection).

## Parameters

### kid?

`string` = `TEST_JWT_KID`

Key id to stamp on the JWK; defaults to [TEST\_JWT\_KID](../variables/TEST_JWT_KID.md).

## Returns

`Promise`\<[`RsaTestKeypair`](../interfaces/RsaTestKeypair.md)\>
