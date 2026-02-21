[Connectum API Reference](../../../../../../index.md) / [@connectum/auth](../../../../index.md) / [@connectum/auth/testing](../index.md) / createMockAuthContext

# Function: createMockAuthContext()

> **createMockAuthContext**(`overrides?`): [`AuthContext`](../../interfaces/AuthContext.md)

Defined in: [packages/auth/src/testing/mock-context.ts:39](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/testing/mock-context.ts#L39)

Create a mock AuthContext for testing.

Merges provided overrides with sensible test defaults.

## Parameters

### overrides?

`Partial`\<[`AuthContext`](../../interfaces/AuthContext.md)\>

Partial AuthContext to override defaults

## Returns

[`AuthContext`](../../interfaces/AuthContext.md)

Complete AuthContext

## Example

```typescript
import { createMockAuthContext } from '@connectum/auth/testing';

const ctx = createMockAuthContext({ subject: 'admin-1', roles: ['admin'] });
assert.strictEqual(ctx.subject, 'admin-1');
assert.deepStrictEqual(ctx.roles, ['admin']);
assert.strictEqual(ctx.type, 'test'); // default preserved
```
