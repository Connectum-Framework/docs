---
title: Runtime Compatibility
description: Separate the framework package requirement from the way your application executes TypeScript.
docType: concept
outline: 2
---

<script setup>
import GuideOverview from '../../.vitepress/theme/components/GuideOverview.vue';
import overview from '../../.vitepress/theme/assets/diagrams/guide/runtime.html?raw';
</script>

# Runtime Compatibility

The runtime requirement depends on **what you execute**. Published framework
packages are compiled JavaScript. Your application's `.ts` files may need
native type stripping, tsx, or Bun.

<figure class="technical-diagram" data-guide-overview="runtime" aria-label="Runtime requirements and feature coverage">
<GuideOverview :source="overview" />
<figcaption>A package engine floor, an application execution requirement and a tested integration are separate claims. Contributor and CI environments have their own requirements.</figcaption>
</figure>

## Choose the path

- **Node.js + compiled JavaScript or tsx:** package floor **≥22.13.0**.
- **Node.js + native TypeScript:** this project's generated source path requires **≥25.2.0**.
- **Bun:** the recorded HTTP/2 client boundary is **≥1.2.6**; an example may
  require a newer version. CLI execution and telemetry have separate limitations.

The framework contributor toolchain has its own higher requirement. No support
for Deno or Cloudflare Workers is implied by their mention in a comparison.

## Go deeper

- [Exact requirements, CI coverage and known limitations](/en/guide/runtime-compatibility-details).
- [Select a TypeScript execution model](/en/guide/typescript/runtime-support).
- [Compare RPC transports and their measured behavior](/en/guide/production/transport-matrix-details).

<GuideSections route="/en/guide/runtime-compatibility" />
