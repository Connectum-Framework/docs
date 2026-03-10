[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / getAuthContext

# Function: getAuthContext()

> **getAuthContext**(): [`AuthContext`](../interfaces/AuthContext.md) \| `undefined`

Defined in: [packages/auth/src/context.ts:44](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/auth/src/context.ts#L44)

Get the current auth context.

Returns the AuthContext set by the auth interceptor in the current
async context. Returns undefined if no auth interceptor is active
or the current method was skipped.

## Returns

[`AuthContext`](../interfaces/AuthContext.md) \| `undefined`

Current auth context or undefined

## Example

```typescript
import { getAuthContext } from '@connectum/auth';

const handler = {
  async getUser(req) {
    const auth = getAuthContext();
    if (!auth) throw new ConnectError('Not authenticated', Code.Unauthenticated);
    return { user: await db.getUser(auth.subject) };
  },
};
```
