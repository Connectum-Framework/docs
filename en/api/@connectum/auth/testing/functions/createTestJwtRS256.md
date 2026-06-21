[Connectum API Reference](../../../../index.md) / [@connectum/auth](../../index.md) / [testing](../index.md) / createTestJwtRS256

# Function: createTestJwtRS256()

> **createTestJwtRS256**(`privateKey`, `payload`, `options`): `Promise`\<`string`\>

Defined in: [packages/auth/src/testing/test-jwt-rs256.ts:133](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/testing/test-jwt-rs256.ts#L133)

Mint an RS256 test JWT signed by the private key from
[generateRsaTestKeypair](generateRsaTestKeypair.md), with a `kid` header matching the published JWK.

NOT for production use.

## Parameters

### privateKey

`CryptoKey`

Private key from [generateRsaTestKeypair](generateRsaTestKeypair.md).

### payload

`Record`\<`string`, `unknown`\>

JWT claims (e.g. `sub`, `roles`, `scope`).

### options

`kid` (required, must match the published JWK) plus optional
  `issuer`/`audience`/`expiresIn` (default `"1h"`).

#### audience?

`string`

#### expiresIn?

`string`

#### issuer?

`string`

#### kid

`string`

## Returns

`Promise`\<`string`\>
