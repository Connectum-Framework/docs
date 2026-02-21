[Connectum API Reference](../../../../index.md) / [@connectum/auth](../../index.md) / [testing](../index.md) / withAuthContext

# Function: withAuthContext()

> **withAuthContext**\<`T`\>(`context`, `fn`): `Promise`\<`T`\>

Defined in: [packages/auth/src/testing/with-context.ts:31](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/auth/src/testing/with-context.ts#L31)

Run a function with a pre-set AuthContext.

Sets the provided AuthContext in AsyncLocalStorage for the duration
of the callback. Useful for testing handlers that call getAuthContext().

## Type Parameters

### T

`T`

## Parameters

### context

[`AuthContext`](../../interfaces/AuthContext.md)

Auth context to set

### fn

() => `T` \| `Promise`\<`T`\>

Function to execute within the context

## Returns

`Promise`\<`T`\>

Return value of fn

## Example

```typescript
import { withAuthContext, createMockAuthContext } from '@connectum/auth/testing';
import { getAuthContext } from '@connectum/auth';

await withAuthContext(createMockAuthContext({ subject: 'test-user' }), async () => {
  const ctx = getAuthContext();
  assert.strictEqual(ctx?.subject, 'test-user');
});
```
