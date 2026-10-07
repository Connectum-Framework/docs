[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / createCatalogClient

# Function: createCatalogClient()

> **createCatalogClient**(`options`): [`CatalogClient`](../interfaces/CatalogClient.md)

Defined in: [packages/core/src/catalogClient.ts:114](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/catalogClient.ts#L114)

Build a standalone [CatalogClient](../interfaces/CatalogClient.md) from a [ServiceCatalog](../type-aliases/ServiceCatalog.md) and a
[RemoteResolver](../type-aliases/RemoteResolver.md).
The example assumes a catalog generated from the Quickstart Greeter proto
and that service running at the configured HTTP/2 endpoint.

## Parameters

### options

[`CreateCatalogClientOptions`](../interfaces/CreateCatalogClientOptions.md)

## Returns

[`CatalogClient`](../interfaces/CatalogClient.md)

## Example

```ts
import { createCatalogClient, mapResolver } from "@connectum/core";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { serviceCatalog } from "./gen/catalog.gen.ts";

const client = createCatalogClient({
  catalog: serviceCatalog,
  resolver: mapResolver({
    "greeter.v1.GreeterService": createGrpcTransport({
      baseUrl: process.env.GREETER_URL ?? "http://localhost:5000",
    }),
  }),
});

// Fully typed off the generated catalog — same surface as ctx.call:
const greeting = await client.call("greeter.v1.GreeterService/SayHello", { name: "Alice" });
console.log(greeting.message); // "Hello, Alice!"
```
