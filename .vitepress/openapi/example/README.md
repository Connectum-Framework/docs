# OpenAPI overlay input

`shop/v1/inventory.proto` supplies the unary and server-streaming Inventory
methods used by the OpenAPI guide. The page edits their compiled method options
and runs the overlay; it does not compile proto or execute buf in the browser.

`connectum/auth/v1/options.proto` is copied unchanged from the `@connectum/auth`
npm package pinned in the dependency manifest, including its Apache-2.0 notice.
A test checks it against the installed package. Keeping this small schema beside
the example allows offline descriptor regeneration without a BSR fetch or a
separate install.

From the documentation repository root:

```sh
pnpm openapi:generate
pnpm openapi:base
pnpm openapi:inspect --annotation roles
```

Descriptor generation uses the installed protobuf-es plugin. Base OpenAPI
generation uses the pinned remote plugin and needs network access. The base
artifact is committed so ordinary site builds and browser use do not depend on
that remote service. `generate-openapi-base.mjs` supplies the required
`info.version` from the fixture API version defined in that script; this is
separate from the generator version and does not alter paths or schemas. Source
and artifact hashes are recorded in `provenance.json`.
