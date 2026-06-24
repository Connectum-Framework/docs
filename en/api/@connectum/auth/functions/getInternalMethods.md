[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / getInternalMethods

# Function: getInternalMethods()

> **getInternalMethods**(`services`): `string`[]

Defined in: [packages/auth/src/proto/reader.ts:222](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/proto/reader.ts#L222)

Get the list of internal method patterns from a set of service descriptors.

Iterates over all methods in the given services, resolves their auth
configuration, and returns patterns for methods marked as `internal`.

Mirrors [getPublicMethods](getPublicMethods.md). Internal methods skip end-user (JWT)
authentication — feed these into the JWT auth interceptor's `skipMethods`
exactly like public methods — but, unlike public methods, they still require
an internal trust marker established by [createInternalAuthInterceptor](createInternalAuthInterceptor.md).

The returned patterns follow the `"service.typeName/method.name"` format
used by `skipMethods` in auth interceptors.

## Parameters

### services

readonly `DescService`[]

Service descriptors to scan

## Returns

`string`[]

Array of method patterns in `"ServiceTypeName/MethodName"` format

## Example

```typescript
import { getInternalMethods, getPublicMethods } from '@connectum/auth/proto';

// JWT auth skips both public and internal methods;
// the internal interceptor then enforces the trust marker on internal ones.
const jwtAuth = createJwtAuthInterceptor({
  jwksUri: '...',
  skipMethods: [...getPublicMethods(services), ...getInternalMethods(services)],
});
```
