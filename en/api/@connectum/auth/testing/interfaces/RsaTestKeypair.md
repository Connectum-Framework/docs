[Connectum API Reference](../../../../index.md) / [@connectum/auth](../../index.md) / [testing](../index.md) / RsaTestKeypair

# Interface: RsaTestKeypair

Defined in: [packages/auth/src/testing/test-jwt-rs256.ts:53](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/testing/test-jwt-rs256.ts#L53)

A generated RSA test keypair plus the public JWK to publish at a JWKS endpoint.

## Properties

### kid

> `readonly` **kid**: `string`

Defined in: [packages/auth/src/testing/test-jwt-rs256.ts:61](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/testing/test-jwt-rs256.ts#L61)

Key id shared by `publicJwk` and the token header (load-bearing for JWKS key selection).

***

### privateKey

> `readonly` **privateKey**: `CryptoKey`

Defined in: [packages/auth/src/testing/test-jwt-rs256.ts:55](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/testing/test-jwt-rs256.ts#L55)

Private signing key — pass to [createTestJwtRS256](../functions/createTestJwtRS256.md).

***

### publicJwk

> `readonly` **publicJwk**: `JWK`

Defined in: [packages/auth/src/testing/test-jwt-rs256.ts:59](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/testing/test-jwt-rs256.ts#L59)

Public JWK (carries `kid`, `alg: "RS256"`, `use: "sig"`) — serve at the JWKS endpoint.

***

### publicKey

> `readonly` **publicKey**: `CryptoKey`

Defined in: [packages/auth/src/testing/test-jwt-rs256.ts:57](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/testing/test-jwt-rs256.ts#L57)

Public verification key.
