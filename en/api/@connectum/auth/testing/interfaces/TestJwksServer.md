[Connectum API Reference](../../../../index.md) / [@connectum/auth](../../index.md) / [testing](../index.md) / TestJwksServer

# Interface: TestJwksServer

Defined in: [packages/auth/src/testing/test-jwt-rs256.ts:80](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/testing/test-jwt-rs256.ts#L80)

A running in-process JWKS server.

## Properties

### origin

> `readonly` **origin**: `string`

Defined in: [packages/auth/src/testing/test-jwt-rs256.ts:84](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/testing/test-jwt-rs256.ts#L84)

Origin (no path), e.g. `http://127.0.0.1:<port>`.

***

### url

> `readonly` **url**: `string`

Defined in: [packages/auth/src/testing/test-jwt-rs256.ts:82](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/testing/test-jwt-rs256.ts#L82)

The JWKS URL — pass as `jwksUri` to `createJwtAuthInterceptor`.

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/auth/src/testing/test-jwt-rs256.ts:86](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/testing/test-jwt-rs256.ts#L86)

Stop the server. Call after the test (e.g. in `after`).

#### Returns

`Promise`\<`void`\>
