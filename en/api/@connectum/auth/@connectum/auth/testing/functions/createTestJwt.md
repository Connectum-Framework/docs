[Connectum API Reference](../../../../../../index.md) / [@connectum/auth](../../../../index.md) / [@connectum/auth/testing](../index.md) / createTestJwt

# Function: createTestJwt()

> **createTestJwt**(`payload`, `options?`): `Promise`\<`string`\>

Defined in: [packages/auth/src/testing/test-jwt.ts:49](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/testing/test-jwt.ts#L49)

Create a signed test JWT for integration testing.

Uses HS256 algorithm with a deterministic test key.
NOT for production use.

## Parameters

### payload

`Record`\<`string`, `unknown`\>

JWT claims

### options?

Signing options

#### audience?

`string`

#### expiresIn?

`string`

#### issuer?

`string`

## Returns

`Promise`\<`string`\>

Signed JWT string

## Example

```typescript
import { createTestJwt, TEST_JWT_SECRET } from '@connectum/auth/testing';

const token = await createTestJwt({
  sub: 'user-123',
  roles: ['admin'],
  scope: 'read write',
});

// Use with createJwtAuthInterceptor in tests
const auth = createJwtAuthInterceptor({ secret: TEST_JWT_SECRET });
```
