[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / perServiceEnvResolver

# Function: perServiceEnvResolver()

> **perServiceEnvResolver**(`map`, `options?`): [`RemoteResolver`](../type-aliases/RemoteResolver.md)

Defined in: [packages/core/src/remoteResolver.ts:115](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/remoteResolver.ts#L115)

A resolver backed by per-service environment variables: `map` pairs each
`typeName` with the name of the env var holding its base URL. A service with
no mapping, or whose env var is unset/empty, resolves to `null`
(→ `Code.Unavailable`). Replaces hand-rolled env registries in boot code.

## Parameters

### map

`Readonly`\<`Record`\<`string`, `string`\>\>

### options?

[`PerServiceEnvResolverOptions`](../interfaces/PerServiceEnvResolverOptions.md)

## Returns

[`RemoteResolver`](../type-aliases/RemoteResolver.md)

## Example

```ts
import { createCatalogClient, perServiceEnvResolver } from "@connectum/core";
import { serviceCatalog } from "./gen/catalog.gen.ts";

// Generate the catalog from the Greeter proto and set GREETER_URL
// to its server's HTTP/2 base URL before running this example.
const client = createCatalogClient({
  catalog: serviceCatalog,
  resolver: perServiceEnvResolver({
    "greeter.v1.GreeterService": "GREETER_URL",
  }),
});
const greeting = await client.call("greeter.v1.GreeterService/SayHello", { name: "Alice" });
console.log(greeting.message); // "Hello, Alice!"
```
