---
title: Understand the Service Catalog
description: Follow protobuf contracts through catalog generation to known services, method names and typed calls.
docType: concept
outline: 2
---

# Service Catalog

How does Orders know that Inventory has a `CheckStock` method, accepts a SKU
and returns a stock count? From **protobuf contracts**, not by scanning the network.
The service catalog brings those known contracts into the application.

<CatalogAssembly />

## 1. Describe what Inventory offers

This excerpt names one RPC in our shared `shop.v1` contract:

```proto
service InventoryService {
  rpc CheckStock(CheckStockRequest) returns (CheckStockResponse);
}
```

The complete proto also defines `CheckStockRequest` with `sku` and
`CheckStockResponse` with `units`.

## 2. Generate the known-service map

The catalog plugin reads the proto inputs you give Buf. Alongside generated
messages, it emits `catalog.gen.ts`. Its runtime map contains descriptors:

```typescript
export const serviceCatalog = {
  'shop.v1.OrdersService': OrdersService,
  'shop.v1.InventoryService': InventoryService,
} as const;
```

The same generated module also tells TypeScript which method keys and
request/response types belong together. Import it into the application and pass
its value to the server:

```typescript
createServer({
  catalog: serviceCatalog,
  services: [orders, inventory],
});
```

The `services` input supplies the implementations; the catalog supplies contract knowledge.

## 3. Call the known contract

Inside the Orders handler:

```ts
const stock = await ctx.call(
  'shop.v1.InventoryService/CheckStock',
  create(CheckStockRequestSchema, { sku: req.sku }),
);
```

The method key uses the proto name `CheckStock`, not the handler name `checkStock`.
TypeScript knows the request shape and that `stock.units` is a number. The full
message created here also works with catalog generators before 1.3.0.

## Knowing a contract is not finding a server

The catalog has **no deployment addresses**. `services` mounts local handlers;
a `remoteResolver` supplies a transport for a non-local target. A catalog entry
alone neither starts a service nor makes it reachable.

- [Watch how the route is chosen](/en/guide/service-communication/resolvers).
- [Run the same Orders → Inventory example](/en/guide/service-communication/routing-example).
- [Configure generation, manual catalogs and type imports](/en/guide/service-communication/catalog-configuration#generating-the-catalog).
- [Let external tools inspect a running server's API](/en/guide/protocols/reflection).

::: details Full catalog topics and earlier section links

### Defining services

[Register handlers or initialize them lazily](/en/guide/service-communication/catalog-configuration#defining-services).

### Configuring the catalog

[Create, freeze and merge runtime catalogs](/en/guide/service-communication/catalog-configuration#configuring-the-catalog).

### Generating the catalog

[Buf plugins, runtime descriptors and TypeScript augmentations](/en/guide/service-communication/catalog-configuration#generating-the-catalog).
Both the generated types and runtime catalog must reach the consumer.

### Unary calls — `ctx.call`

[Request types, procedure keys and dispatch](/en/guide/service-communication/catalog-configuration#unary-calls).

### Streaming calls — `ctx.stream`

[Server, client and bidirectional streams](/en/guide/service-communication/catalog-configuration#streaming-calls).

### Cascade behaviour (`CallOptions`)

[Signals, inherited deadlines and explicit overrides](/en/guide/service-communication/catalog-configuration#cascade-behaviour-calloptions).

### Header propagation

[Explicit header forwarding; no implicit credential propagation](/en/guide/service-communication/catalog-configuration#header-propagation).

### Outgoing interceptors

[One application policy chain across routes](/en/guide/service-communication/catalog-configuration#outgoing-interceptors).

### Single-image, multiple roles — `enabledServices`

[Select locally mounted services and check version boundaries](/en/guide/service-communication/catalog-configuration#single-image-multiple-roles-enabledservices).

### Calling from outside a handler

[Server clients and standalone catalog clients](/en/guide/service-communication/catalog-configuration#calling-from-outside-a-handler).

### Error model

[Configuration failures, failed calls and route caching](/en/guide/service-communication/catalog-configuration#error-model).

### Related

[Complete catalog configuration and behavior](/en/guide/service-communication/catalog-configuration).

### Watch one call

[The routing illustration now lives with Remote Resolvers](/en/guide/service-communication/resolvers#watch-one-call).

### Three pieces. Different jobs.

#### Contracts

The catalog describes known contracts.

#### Implementations

`services` supplies local handlers.

#### Routes

`remoteResolver` supplies remote transports.

### Run the same example

[All six files and the run commands](/en/guide/service-communication/routing-example#run-the-same-example).

### `package.json`

[Example dependencies and scripts](/en/guide/service-communication/routing-example#package-json).

### `buf.yaml`

[Example Buf module](/en/guide/service-communication/routing-example#buf-yaml).

### `buf.gen.yaml`

[Example generation plugins](/en/guide/service-communication/routing-example#buf-gen-yaml).

### `tsconfig.json`

[Example TypeScript configuration](/en/guide/service-communication/routing-example#tsconfig-json).

### `proto/shop/v1/catalog.proto`

[Complete Orders and Inventory contract](/en/guide/service-communication/routing-example#proto-shop-v1-catalog-proto).

### `src/server.ts`

[Complete handler and server implementations](/en/guide/service-communication/routing-example#src-server-ts).

### Check the result

[Make the real HTTP/2 request](/en/guide/service-communication/routing-example#check-the-result).

### Move Inventory out

[Run the services in separate processes](/en/guide/service-communication/routing-example#move-inventory-out).

### Remove the route

[Observe a missing route](/en/guide/service-communication/routing-example#remove-the-route).

### Keep the full picture

[Complete configuration, errors and limitations](/en/guide/service-communication/catalog-configuration).
:::
