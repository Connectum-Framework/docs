[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [utils/reflection](../index.md) / fetchReflectionData

# Function: fetchReflectionData()

> **fetchReflectionData**(`url`): `Promise`\<[`ReflectionResult`](../interfaces/ReflectionResult.md)\>

Defined in: [utils/reflection.ts:42](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/cli/src/utils/reflection.ts#L42)

Fetch service and file descriptor information from a running server via reflection.

Uses gRPC Server Reflection Protocol (v1 with v1alpha fallback).

## Parameters

### url

`string`

Server URL (e.g., "http://localhost:5000")

## Returns

`Promise`\<[`ReflectionResult`](../interfaces/ReflectionResult.md)\>

ReflectionResult with services, registry, and file names

## Example

```typescript
const result = await fetchReflectionData("http://localhost:5000");
console.log(result.services); // ["grpc.health.v1.Health", ...]
```
