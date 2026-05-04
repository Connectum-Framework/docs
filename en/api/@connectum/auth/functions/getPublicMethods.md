[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / getPublicMethods

# Function: getPublicMethods()

> **getPublicMethods**(`services`): `string`[]

Defined in: [packages/auth/src/proto/reader.ts:165](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/auth/src/proto/reader.ts#L165)

Get the list of public method patterns from a set of service descriptors.

Iterates over all methods in the given services, resolves their auth
configuration, and returns patterns for methods marked as `public`.

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
import { getPublicMethods } from '@connectum/auth/proto';

const publicMethods = getPublicMethods([GreeterService, HealthService]);
// ["greet.v1.GreeterService/SayHello", "grpc.health.v1.Health/Check"]

const authn = createAuthInterceptor({
  skipMethods: publicMethods,
  verifyCredentials: myVerifier,
});
```
