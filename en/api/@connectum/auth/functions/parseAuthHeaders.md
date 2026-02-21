[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / parseAuthHeaders

# Function: parseAuthHeaders()

> **parseAuthHeaders**(`headers`): [`AuthContext`](../interfaces/AuthContext.md) \| `undefined`

Defined in: [packages/auth/src/headers.ts:91](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/headers.ts#L91)

Parse AuthContext from request headers.

Deserializes auth context from standard headers set by an upstream
service or gateway. Returns undefined if required headers are missing.

WARNING: Only use this in trusted environments (behind mTLS, mesh, etc.).
For untrusted environments, use createTrustedHeadersReader() instead.

## Parameters

### headers

`Headers`

Request headers to parse

## Returns

[`AuthContext`](../interfaces/AuthContext.md) \| `undefined`

Parsed AuthContext or undefined if headers are missing

## Example

```typescript
import { parseAuthHeaders } from '@connectum/auth';

const context = parseAuthHeaders(req.header);
if (context) {
  console.log(`Authenticated as ${context.subject}`);
}
```
