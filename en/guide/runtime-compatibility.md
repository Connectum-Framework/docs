---
title: Runtime Compatibility
description: Separate the framework package requirement from the way your application executes TypeScript.
docType: concept
outline: 2
---

# Runtime Compatibility

The runtime requirement depends on **what you execute**. Published framework
packages are compiled JavaScript. Your application's `.ts` files may need
native type stripping, tsx, or Bun.

<GuideFlow scene="runtime-compatibility">
<figure class="guide-map" aria-label="Choose a runtime by the application execution model">
<ol>
<li><strong>Package</strong><small>Published @connectum packages declare Node.js ≥22.13.0.</small></li>
<li><strong>Application</strong><small>Native Node.js TypeScript needs ≥25.2.0; tsx follows the package floor.</small></li>
<li><strong>Integration</strong><small>Check the actual runtime, transport and optional modules you use.</small></li>
</ol>
<figcaption>A package engine floor, a source execution requirement and a tested integration are different claims.</figcaption>
</figure>
</GuideFlow>

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
