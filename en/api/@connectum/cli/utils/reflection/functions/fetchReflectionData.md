[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [utils/reflection](../index.md) / fetchReflectionData

# Function: fetchReflectionData()

> **fetchReflectionData**(`url`, `options?`): `Promise`\<[`ReflectionResult`](../interfaces/ReflectionResult.md)\>

Defined in: [utils/reflection.ts:255](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/utils/reflection.ts#L255)

Fetch service and file descriptor information from a running server via reflection.

Uses gRPC Server Reflection Protocol (v1 with v1alpha fallback). Fails, naming them,
when the server lists a service it cannot describe, and when a request exceeds the time limit.

## Parameters

### url

`string`

Server URL (e.g., "http://localhost:5000")

### options?

[`ReflectionOptions`](../interfaces/ReflectionOptions.md) = `{}`

Time limit of each request

## Returns

`Promise`\<[`ReflectionResult`](../interfaces/ReflectionResult.md)\>

ReflectionResult with services, registry, and file names

## Example

```typescript
const result = await fetchReflectionData("http://localhost:5000");
console.log(result.services); // ["grpc.health.v1.Health", ...]
```
