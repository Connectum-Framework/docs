# Catalog and resolver lessons

`model.ts` describes the three bounded routing scenes; it does not run a server in
the browser. The component says so explicitly. Its displayed call is checked
against `example/src/server.ts` by `pnpm catalog:test`, which also runs in CI.

The contract-generation overview lives at `en/guide/service-communication/service-catalog.md`.
`ResolverWalkthrough.vue` belongs to `en/guide/service-communication/resolvers.md`;
the executable lesson lives at `en/guide/service-communication/routing-example.md`.
Complete catalog behavior lives at `en/reference/service-catalog.md`, and resolver
configuration at `en/guide/service-communication/resolver-configuration.md`.
Keep the former learning and configuration pages' fragment URLs when changing layouts.

The six example files are included directly by VitePress and the LLM plugin, not
copied into a second set of Markdown snippets. To verify them as a consumer, copy
`example/` into a scratch folder, then run `npm install`, `npm run generate` and
`npm run typecheck`. Run the combined process, then the separate Inventory and
Orders roles using the commands on the executable lesson page. Check the real HTTP/2 calls
for both successful routing and a missing route; a browser-model test alone is
not evidence that the published packages behave that way.

The example deliberately pins published 1.2.0 core/catalog packages and uses full
protobuf request messages. It must not acquire an unpublished CLI prerequisite
just because the reference describes the upcoming 1.3 line.
