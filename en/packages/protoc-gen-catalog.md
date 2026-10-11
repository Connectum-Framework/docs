---
title: '@connectum/protoc-gen-catalog'
description: Buf/protoc plugin that generates typed Connectum service-catalog call and stream maps.
docType: package-hub
---

# @connectum/protoc-gen-catalog

Buf/protoc plugin that generates typed Connectum service-catalog call and stream maps.

## Install {#installation}

::: pm
== npm
~~~bash
npm install -D @connectum/protoc-gen-catalog
~~~
== pnpm
~~~bash
pnpm add -D @connectum/protoc-gen-catalog
~~~
== bun
~~~bash
bun add -d @connectum/protoc-gen-catalog
~~~
:::

The plugin keeps `@bufbuild/protobuf` as its own regular dependency: it runs at
code-generation time, and `@bufbuild/protoplugin` pins `@bufbuild/protobuf` exactly, so it
is outside the single-copy guarantee that the runtime packages give through
[peer dependencies](/en/migration/peer-dependencies).

## Start Here {#quick-start}

~~~yaml
plugins:
  - local: protoc-gen-connectum-catalog
    strategy: all
    out: gen
    opt:
      - import_extension=.ts
~~~

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `protoc-gen-connectum-catalog` | Generate catalog descriptors and TypeScript module augmentation. |
| `protocGenCatalog` | Plugin definition exported for tooling integration. |

## Learn / Configure / API Reference {#api-reference}

- **Learn:** [Focused guide](/en/guide/service-communication/service-catalog)
- **Configure:** [Task and configuration guidance](/en/guide/service-communication/service-catalog)
- **API reference:** [Generated TypeDoc](/en/api/@connectum/protoc-gen-catalog/)
- **Source:** [@connectum/protoc-gen-catalog on GitHub](https://github.com/Connectum-Framework/connectum/tree/main/packages/protoc-gen-catalog)

## Related Modules {#related-packages}

[Compare all Connectum packages](/en/packages/) by capability.

<!-- Compatibility anchors retained from the former exhaustive package page. -->
<div class="legacy-anchors" aria-hidden="true">
<span id="what-it-generates"></span>
<span id="usage-bufgenyaml"></span>
<span id="options"></span>
<span id="important"></span>
</div>
