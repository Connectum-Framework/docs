[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / createCatalogClient

# Function: createCatalogClient()

> **createCatalogClient**(`options`): [`CatalogClient`](../interfaces/CatalogClient.md)

Defined in: [packages/core/src/catalogClient.ts:108](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/catalogClient.ts#L108)

Build a standalone [CatalogClient](../interfaces/CatalogClient.md) from a [ServiceCatalog](../type-aliases/ServiceCatalog.md) and a
[RemoteResolver](../type-aliases/RemoteResolver.md).

## Parameters

### options

[`CreateCatalogClientOptions`](../interfaces/CreateCatalogClientOptions.md)

## Returns

[`CatalogClient`](../interfaces/CatalogClient.md)

## Example

```ts
import { createCatalogClient, mapResolver } from "@connectum/core";
import { serviceCatalog } from "./gen/catalog.ts"; // @connectum/protoc-gen-catalog

const client = createCatalogClient({
  catalog: serviceCatalog,
  resolver: mapResolver({
    "fleet.v1.FleetService": createGrpcTransport({ baseUrl: process.env.FLEET_ADDR }),
  }),
});

// Fully typed off the generated catalog — same surface as ctx.call:
const trip = await client.call("trip.v1.TripService/StartTrip", { vehicleId });
```
