[Connectum API Reference](../../../../index.md) / [@connectum/auth](../../index.md) / [testing](../index.md) / createMockAuthContext

# Function: createMockAuthContext()

> **createMockAuthContext**(`overrides?`): [`AuthContext`](../../interfaces/AuthContext.md)

Defined in: [packages/auth/src/testing/mock-context.ts:39](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/auth/src/testing/mock-context.ts#L39)

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
