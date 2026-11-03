---
title: Run the Orders to Inventory Routing Example
description: Run a real catalog call locally, across two processes, and without a route using published packages.
docType: tutorial
outline: 2
---

# Run the Orders → Inventory Example

This is the executable companion to the
[routing illustration](/en/guide/service-communication/resolvers).
Orders calls Inventory for stock. Keep the same handler while changing where
Inventory runs, then observe what happens when its route is missing.

## Run the same example

You need **Node.js ≥22.13**, npm, and a curl build with HTTP/2 support. The complete
example uses the published **1.2.0** core and generator, with full protobuf request
messages; it does not require the unpublished 1.3 CLI. No broker or telemetry
backend is needed.

Create an empty folder and add the six files below. Generate the contracts once,
then start both services in one process:

```sh
npm install
npm run generate
npm start
```

::: details Complete example — all six files
Use these paths relative to your project folder. `gen/` is created by Buf; do not
write the generated catalog by hand.

### `package.json`

<<< @/.vitepress/catalog/example/package.json

### `buf.yaml`

<<< @/.vitepress/catalog/example/buf.yaml

### `buf.gen.yaml`

<<< @/.vitepress/catalog/example/buf.gen.yaml

### `tsconfig.json`

<<< @/.vitepress/catalog/example/tsconfig.json

### `proto/shop/v1/catalog.proto`

<<< @/.vitepress/catalog/example/proto/shop/v1/catalog.proto

### `src/server.ts`

<<< @/.vitepress/catalog/example/src/server.ts
:::

### Check the result

In another terminal, call Orders. Its handler calls Inventory for SKU `A-1`:

```sh
curl --http2-prior-knowledge http://127.0.0.1:5000/shop.v1.OrdersService/CheckAvailability \
  -H 'Content-Type: application/json' \
  -H 'Connect-Protocol-Version: 1' \
  -d '{"sku":"A-1"}'
```

Expected response: `{"sku":"A-1","available":true}`. Inventory's sample handler
returned seven units; Orders turned that into an availability result.

### Move Inventory out

Stop the combined process. Start Inventory in one terminal and Orders in another:

**Terminal 1 · Inventory**

```sh
ROLE=inventory npm start
```

**Terminal 2 · Orders**

```sh
ROLE=orders INVENTORY_URL=http://127.0.0.1:6000 npm start
```

Run the **same curl command** again. Expect the same response. The Orders handler
did not change; its catalog call now crosses the process boundary.

### Remove the route

Restart only Orders without `INVENTORY_URL`:

```sh
ROLE=orders npm start
```

The same request now returns an `unavailable` error (HTTP 503). The contract is
still known, but the resolver has no transport for Inventory. Restore the URL and
restart Orders to restore the route.

::: warning What this example does not provide
This is a localhost teaching example using plaintext HTTP/2. It does not add
authentication, business validation, retries or distributed transactions.
Local and network calls are not identical security or serialization tests.
Configure [security](/en/guide/security), [validation](/en/guide/validation) and
[observability](/en/guide/observability) when your application needs them.
:::

## Keep the full picture

The same catalog also supports streaming, inherited deadlines, explicit header
propagation and callers outside a handler. These do not need to be learned before
the first working call. The complete details are in the
[configuration and behavior reference](/en/reference/service-catalog).

## Related

- [Full catalog reference](/en/reference/service-catalog)
- [Remote resolvers](/en/guide/service-communication/resolvers)
- [How the catalog is formed](/en/guide/service-communication/service-catalog)
- [Communication patterns](/en/guide/service-communication/patterns)
- [Generated core API](/en/api/@connectum/core/)
