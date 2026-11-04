[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / parseAuthHeaders

# Function: parseAuthHeaders()

> **parseAuthHeaders**(`headers`): [`AuthContext`](../interfaces/AuthContext.md) \| `undefined`

Defined in: [packages/auth/src/headers.ts:340](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/headers.ts#L340)

Parse AuthContext from request headers.

Deserializes auth context from standard headers set by an upstream
service or gateway. Returns undefined if required headers are missing.

Nothing is cut or ignored: a header that cannot be read back without loss (a value longer than
its limit, a malformed `utf-8''` text, a decoded text with NUL, CR or LF) is refused. Other C0 controls and
DEL are removed from the subject, type and name, raw or decoded, as the writer removes them.

WARNING: Only use this in trusted environments (behind mTLS, mesh, etc.).
For gateway requests, use createGatewayAuthInterceptor() with a verified trust header.

## Parameters

### headers

`Headers`

Request headers to parse

## Returns

[`AuthContext`](../interfaces/AuthContext.md) \| `undefined`

Parsed AuthContext or undefined if headers are missing

## Throws

`Code.Unauthenticated` when a header holds a value longer than its limit or a malformed encoded text

## Example

**Trust upstream auth headers**

```typescript
import { parseAuthHeaders } from '@connectum/auth';

const context = parseAuthHeaders(req.header);
if (context) {
  console.log(`Authenticated as ${context.subject}`);
}
```
